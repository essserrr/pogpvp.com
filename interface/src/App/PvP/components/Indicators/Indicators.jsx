import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import CpAndTyping from "App/Components/CpAndTypes/CpAndTypes";
import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import HPIndicator from "./HPIndicator/HPIndicator"
import EnergyIndicator from "./EnergyIndicator/EnergyIndicator"
import EnergyNumber from "./EnergyNumber/EnergyNumber"
import { calculateDamage, calculateMultiplier } from "js/indexFunctions"
import { getCookie } from "js/getCookie"

import { locale } from "locale/locale"
import { moveTips } from "locale/Pvp/MoveTips/MoveTips";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "174px !important",
    },
}));

let strings = new LocalizedStrings(locale)
let moveStrings = new LocalizedStrings(moveTips);

const Indicators = React.memo(function Indicators(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    moveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    const classes = useStyles();
    const HP = Number(props.value.HP);
    const Energy = Number(props.value.Energy);

    return (
        <GreyPaper className={classes.root} elevation={4} enablePadding paddingMult={0.25}>
            <Grid container alignItems="center" justify={"space-around"} spacing={1}>

                <Grid item xs={12}>
                    <CpAndTyping hideCp isShadow={props.value.IsShadow === "true"} pokemonTable={props.pokemonTable} name={props.value.name} />
                </Grid>

                <Grid item xs={12}>
                    <HPIndicator value={HP} maxValue={props.value.effSta} />
                </Grid>

                <Grid item xs="auto">
                    {props.chargeMove1 &&
                        <EnergyIndicator value={Energy} maxValue={-props.chargeMove1.PvpEnergy} move={props.chargeMove1}
                            damage={calculateDamage(props.chargeMove1.PvpDamage, props.value.effAtk, props.value.effDef, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove1.MoveType))} />}
                </Grid>
                <Grid item xs="auto">
                    <EnergyNumber value={Energy} />
                </Grid>

                <Grid item xs="auto">
                    {props.chargeMove2 &&
                        <EnergyIndicator value={Energy} maxValue={-props.chargeMove2.PvpEnergy} move={props.chargeMove2}
                            damage={calculateDamage(props.chargeMove2.PvpDamage, props.aAttack, props.value.effDef, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove2.MoveType))} />}
                </Grid>

            </Grid>
        </GreyPaper>
    )
});

export default Indicators;

Indicators.propTypes = {
    value: PropTypes.object,
    pokemonTable: PropTypes.object,
    attr: PropTypes.string,

    chargeMove1: PropTypes.object,
    chargeMove2: PropTypes.object,

    attackerTypes: PropTypes.array,
    defenderTypes: PropTypes.array,
};