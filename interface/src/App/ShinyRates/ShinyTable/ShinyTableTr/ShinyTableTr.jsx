import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Iconer from "App/Components/Iconer/Iconer";
import useAnimation from "css/hoverAnimation";

import { locale } from "locale/ShinyRates/ShinyRates";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const useStyles = makeStyles((theme) => ({
    link: {
        fontSize: "1.1em",
        marginLeft: `${theme.spacing(0.5)}px`,
        color: theme.palette.text.link,
        "&:hover": {
            textDecoration: "underline",
        },
    },
}));

const ShinyTableTr = React.memo(function ShinyTableTr(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();
    const animation = useAnimation();
    const pokemon = props.pokTable[props.pok.Name];

    function processRate(chance) {
        let ratesList = [24, 60, 90, 120, 240, 450, 800,]
        //in reverse direction
        for (let i = ratesList.length - 1; i >= 0; i--) {
            //if two chances are equal
            if (chance === ratesList[i]) {
                return ratesList[i]
            }
            //if chance to find lower than chance in the table
            if (chance < ratesList[i]) {
                continue
            }
            //if it is the first entry, return it
            if (!ratesList[i + 1]) {
                return ratesList[i]
            }
            //otherwise calculate delta to two nearest chances
            let deltaLeft = chance - ratesList[i]
            let deltaRight = ratesList[i + 1] - chance
            switch (true) {
                case deltaLeft > deltaRight:
                    return ratesList[i + 1]
                case deltaLeft < deltaRight:
                    return ratesList[i]
                default:
                    //return highest by default
                    return ratesList[i + 1]
            }
        }
        return ratesList[0]
    }

    return (
        <TableRow className={animation.animation}>
            <TableCell component="th" scope="row" align="left">
                <Iconer
                    fileName={pokemon.Number + (pokemon.Forme !== "" ? "-" + pokemon.Forme : "")}
                    folderName="/pokemons/"
                    size={36}
                />

                <Link className={classes.link}
                    title={`${strings.dexentr} ${props.pok.Name}`}
                    to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.pok.Name)}>
                    {props.pok.Name}
                </Link>
            </TableCell>
            <TableCell align="center">{"1/" + props.pok.Odds + " (" + (1 / props.pok.Odds * 100).toFixed(2) + "%)"}</TableCell>
            <TableCell align="center">{"1/" + processRate(props.pok.Odds)}</TableCell>
            <TableCell align="center">{props.pok.Checks}</TableCell>
        </TableRow>
    )

});

export default ShinyTableTr;

ShinyTableTr.propTypes = {
    pok: PropTypes.object.isRequired,
    pokTable: PropTypes.object.isRequired,
};