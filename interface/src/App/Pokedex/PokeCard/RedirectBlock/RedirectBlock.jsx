import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import SliderBlock from "App/Components/SliderBlock/SliderBlock";
import SliderButton from "App/Components/SliderBlock/SliderButton/SliderButton";

import { encodeQueryData } from "js/indexFunctions";
import { calculateMaximizedStats } from "js/Maximizer/Maximizer";
import { selectQuick } from "js/MoveSelector/selectQuick";
import { selectCharge } from "js/MoveSelector/selectCharge";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    linkBlock: {
        width: "100%",
        height: "100%",
        display: "block"
    },
}));

const RedirectBlock = React.memo(function RedirectBlock(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();


    const generatePokObj = (name, stat, shields, isShadow, quick, charge) => {
        return {
            name: name, Lvl: stat.Level, Atk: stat.Atk, Def: stat.Def, Sta: stat.Sta, Shields: shields,
            AtkStage: 0, DefStage: 0, InitialHP: 0, InitialEnergy: 0,
            IsGreedy: true, IsShadow: isShadow,
            QuickMove: quick, ChargeMove1: charge.primaryName, ChargeMove2: charge.secodaryName,
        }
    }

    const pokStats = calculateMaximizedStats(props.value.Title, 40, props.pokTable).great.Overall

    const quick = selectQuick(props.value.QuickMoves.map(move => { return { value: move } }),
        props.moveTable, props.value.Title, props.pokTable)

    const charge = selectCharge(props.value.ChargeMoves.map(move => { return { value: move } }),
        props.moveTable, props.value.Title, props.pokTable)

    const pokString = encodeQueryData(generatePokObj(props.value.Title, pokStats, 0, false, quick, charge))

    const toPvp = navigator.userAgent === "ReactSnap" ? "/" : "/pvp/single/great/" + pokString
    const toPve = navigator.userAgent === "ReactSnap" ? "/" : "/pve/common/_/" + encodeURIComponent(props.value.Title) + "___4/0_0_0_18_3_true_false/___40_15_15_15_false"

    return (
        <SliderBlock>
            <SliderButton hoverable toggled={false}>
                <Link to={toPvp}>
                    {strings.pvpwith}
                </Link>
            </SliderButton>

            <SliderButton hoverable toggled={false}>
                <Link className={classes.linkBlock} to={toPve}>
                    {strings.pvewith}
                </Link>
            </SliderButton>
        </SliderBlock >
    )
});

export default RedirectBlock;

RedirectBlock.propTypes = {
    value: PropTypes.object,
    pokMisc: PropTypes.object,

    moveTable: PropTypes.object.isRequired,
    pokTable: PropTypes.object.isRequired,
};