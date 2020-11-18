import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ChargeEnergy from "./PokedexChargeEnergy/PokedexChargeEnergy";
import { typeDecoder } from "js/decoders/typeDecoder";
import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const useStyles = props => makeStyles(theme => {
    return ({
        mainText: {
            fontSize: "1.1em",
            fontWeight: 400,
        },
        auxText: {
            fontSize: "0.85em",
            fontWeight: 500,
        },
        dpsBlock: {
            padding: `${theme.spacing(0.75)}px`,
            marginRight: `${theme.spacing(0.5)}px`,

            borderRadius: "3px 0px 0px 3px",

            textAlign: "center",

            "&:hover": {
                color: theme.palette.text.primary,
            }
        },
        mainBlock: {
            padding: `${theme.spacing(0.5)}px ${theme.spacing(1.25)}px ${theme.spacing(0.5)}px ${theme.spacing(1.25)}px`,
            borderRadius: "0px 3px 3px 0px",

            "&:hover": {
                color: theme.palette.text.primary,
            }
        },
        moveColor: {
            color: theme.palette.types[`type${props.type}`].text,
            backgroundColor: theme.palette.types[`type${props.type}`].background,
        },

        flexCol: {
            flex: "0 0 100%",
            maxWidth: "100%",
            display: "flex",
        },

    })
});

const Move = React.memo(function Move(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { MoveType, Title, Cooldown, Damage, MoveCategory, Energy } = props.value;
    const classes = useStyles({ type: MoveType })();;

    let isElite = props.pok.EliteMoves[Title] === 1 || Title === "Return";
    const title = `${strings.dexentr} ${Title}`;
    const to = (navigator.userAgent === "ReactSnap") ? "/" : "/movedex/id/" + encodeURIComponent(Title)

    return (

        <Link className={classes.flexCol} title={title} to={to}>

            <Grid item xs={3} md={2} className={`${classes.mainText} ${classes.dpsBlock} ${classes.moveColor}`}>
                DPS<br />
                {(Damage / (Cooldown / 1000)).toFixed(1)}
            </Grid>

            <Grid item xs={9} md={10} className={`${classes.mainBlock} ${classes.moveColor}`}>

                <Grid item xs={12} className={`${classes.mainText}`}>
                    {`${Title}${isElite ? "*" : ""}`}
                </Grid>

                <Grid item xs={12} className={classes.auxText}>
                    {typeDecoder[MoveType]}{"/"}
                    {strings.dabbr}:{Damage}{"/"}
                    {strings.cdabbr}:{Cooldown / 1000}{strings.s}
                    {MoveCategory === "Fast Move" ? "/EPS:" + (Energy / (Cooldown / 1000)).toFixed(1) : ""}
                </Grid>

                {MoveCategory === "Charge Move" && <ChargeEnergy move={props.value} />}

            </Grid>

        </Link>

    )
});

export default Move;

Move.propTypes = {
    value: PropTypes.object,
    pok: PropTypes.object,
};