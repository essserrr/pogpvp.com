import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as Shadow } from "icons/shadow.svg";
import Iconer from "App/Components/Iconer/Iconer";
import Tip from "./Tip";

import { addStar } from "js/addStar";
import { getCookie } from "js/getCookie";
import { pvp } from "locale/Pvp/Pvp";
import { options } from "locale/Components/Options/locale";

const useStyles = makeStyles((theme) => ({
    shadow: {
        width: 16,
        height: 16,
        position: "absolute",
        top: -3,
        right: -3,
    }
}));

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);

const TableIcon = React.memo(function TableIcon(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();

    const { name, IsShadow, QuickMove, ChargeMove1, ChargeMove2 } = props.pok;
    const pokemon = props.pokemonTable[name];

    const fileName = pokemon.Number + (pokemon.Forme !== "" ? "-" + pokemon.Forme : "")

    return (
        <Grid container justify="center" alignItems="center">

            <Tooltip arrow placement={"top"}
                title={<Tip pok={props.pok} pokemonTable={props.pokemonTable} moveTable={props.moveTable} />}>

                <Box position="relative">
                    {String(IsShadow) === "true" && <Shadow className={classes.shadow} />}
                    <Iconer folderName="/pokemons/" fileName={fileName} size={36} />
                </Box>

            </Tooltip>

            <Grid item xs={12}>
                {QuickMove.replace(/[a-z -]/g, "") + addStar(name, QuickMove, props.pokemonTable)}
                {ChargeMove1 || ChargeMove2 ? "+" : ""}
                {ChargeMove1 ? ChargeMove1.replace(/[a-z -]/g, "") + addStar(name, ChargeMove1, props.pokemonTable) : ""}
                {ChargeMove1 && ChargeMove2 ? "/" : ""}
                {ChargeMove2 ? ChargeMove2.replace(/[a-z -]/g, "") + addStar(name, ChargeMove2, props.pokemonTable) : ""}
            </Grid>
        </Grid>
    )
});

export default TableIcon;

TableIcon.propTypes = {
    pok: PropTypes.object,
    i: PropTypes.number,
    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};