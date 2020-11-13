import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { breakoints } from "locale/Pve/Breakpoints/Breakpoints";
import { calculateDamage, returnEffAtk, getPveMultiplier } from "js/indexFunctions";
import { getCookie } from "../../../../../js/getCookie"

let pvestrings = new LocalizedStrings(breakoints);

const useStyles = makeStyles((theme) => ({
    borderTop: {
        borderTop: "1px solid rgba(0, 0, 0, 0.295)",
    },
}));

const BreakpointsList = React.memo(function BreakpointsList(props) {
    pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();

    const multiplier = getPveMultiplier(props.attacker.Type, props.boss.Type, props.move.MoveType, props.weather, props.friend);
    let baseDamage = calculateDamage(props.move.Damage, returnEffAtk(props.Atk, props.attacker.Atk, props.Lvl, props.IsShadow), props.effDef, multiplier);
    let arr = [];

    for (let i = Number(props.Lvl); i <= 45; i += 0.5) {
        let damage = calculateDamage(props.move.Damage, returnEffAtk(props.Atk, props.attacker.Atk, i, props.IsShadow), props.effDef, multiplier)
        if (damage > baseDamage) {
            baseDamage = damage
            arr.push(
                <Grid item xs={12} key={`${i}-${damage}`}>
                    <Typography align="center">
                        {`${pvestrings.lvl}: `}<b>{Number(i).toFixed(1)}</b>{`, ${pvestrings.damage}: `}<b>{damage}</b>
                    </Typography>
                </Grid>
            )
        }
    }

    return (
        arr.length > 0 &&
        <Grid container spacing={1}>
            <Grid item xs={12} className={classes.borderTop} >
                <Typography align="center">
                    {pvestrings.qbreak} <b>{props.move.Title}</b>
                </Typography>
            </Grid>
            {arr}

        </Grid>
    )

});

export default BreakpointsList;

BreakpointsList.propTypes = {
    move: PropTypes.object,
    attacker: PropTypes.object,
    boss: PropTypes.object,

    IsShadow: PropTypes.bool,
    Lvl: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    effDef: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    Atk: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    friend: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    weather: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
};