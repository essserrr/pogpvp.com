import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { getCookie } from "js/getCookie";
import { locale } from "locale/Pve/Pve";

let pveStrings = new LocalizedStrings(locale);

const useStyles = makeStyles((theme) => ({
    marginRight: {
        marginRight: `${theme.spacing(0.75)}px`,
    },
}));

const FightStats = React.memo(function FightStats(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container>
            {props.dAvg !== undefined &&
                <Grid item xs={6}>
                    <i className={`${classes.marginRight} fas fa-crosshairs`}></i>
                    {`${props.dAvg}%`}
                    {props.dMin !== undefined && props.dMax !== undefined && ` (${props.dMin}% - ${props.dMax}%)`}
                </Grid>}

            {props.plAvg !== undefined &&
                <Grid item xs={6}>
                    <i className={`${classes.marginRight} fas fa-users`}></i>
                    {`${props.plAvg}`}
                    {props.plMin !== undefined && props.plMax !== undefined && ` (${props.plMin} - ${props.plMax})`}
                </Grid>}

            {props.dpsAvg !== undefined &&
                <Grid item xs={6}>
                    <i className={`${classes.marginRight} fab fa-cloudscale`}></i>
                    {`${props.dpsAvg}`}
                    {props.dpsMin !== undefined && props.dpsMax !== undefined && ` (${props.dpsMin} - ${props.dpsMax})`}
                </Grid>}

            {props.FMin !== undefined && props.FMax !== undefined &&
                <Grid item xs={6}>
                    <i className={`${classes.marginRight} fas fa-skull-crossbones`}></i>
                    {`${props.FMin} - ${props.FMax}`}
                </Grid>}

            {props.tAvg !== undefined &&
                <Grid item xs={6}>
                    <i className={`${classes.marginRight} far fa-clock`}></i>
                    {`${props.tAvg}${pveStrings.s}`}
                    {props.tMin !== undefined && props.tMax !== undefined && ` (${props.tMin}${pveStrings.s} - ${props.tMax}${pveStrings.s})`}
                </Grid>}

            {props.ttwAvg &&
                <Grid item xs={6}>
                    <i className={`${classes.marginRight} far fa-hourglass`}></i>
                    {`${props.ttwAvg}${pveStrings.s}`}
                </Grid>}

        </Grid>
    )
});

export default FightStats;

FightStats.propTypes = {
    dAvg: PropTypes.string,
    dMin: PropTypes.string,
    dMax: PropTypes.string,

    tAvg: PropTypes.string,
    tMin: PropTypes.string,
    tMax: PropTypes.string,

    dpsAvg: PropTypes.string,
    dpsMin: PropTypes.string,
    dpsMax: PropTypes.string,

    plAvg: PropTypes.string,
    plMin: PropTypes.number,
    plMax: PropTypes.number,

    ttwAvg: PropTypes.number,

    FMin: PropTypes.number,
    FMax: PropTypes.number,
};