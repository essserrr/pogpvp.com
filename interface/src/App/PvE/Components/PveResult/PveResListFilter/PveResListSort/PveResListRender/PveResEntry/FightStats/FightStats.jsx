import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { FaCrosshairs, FaUsers, FaCloudscale, FaSkullCrossbones, FaRegClock, FaRegHourglass } from 'react-icons/fa';

import { getCookie } from "js/getCookie";
import { locale } from "locale/Pve/Pve";

let pveStrings = new LocalizedStrings(locale);

const useStyles = makeStyles((theme) => ({
    statsIcon: {
        width: 16,
        height: 16,
        marginRight: `${theme.spacing(0.75)}px`,
    },
}));

const FightStats = React.memo(function FightStats(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container>
            {props.dAvg !== undefined &&
                <Grid item xs={6} container alignItems="center">
                    <FaCrosshairs className={classes.statsIcon} />
                    {`${props.dAvg}%`}
                    {props.dMin !== undefined && props.dMax !== undefined && ` (${props.dMin}% - ${props.dMax}%)`}
                </Grid>}

            {props.plAvg !== undefined &&
                <Grid item xs={6} container alignItems="center">
                    <FaUsers className={classes.statsIcon} />
                    {`${props.plAvg}`}
                    {props.plMin !== undefined && props.plMax !== undefined && ` (${props.plMin} - ${props.plMax})`}
                </Grid>}

            {props.dpsAvg !== undefined &&
                <Grid item xs={6} container alignItems="center">
                    <FaCloudscale className={classes.statsIcon} />
                    {`${props.dpsAvg}`}
                    {props.dpsMin !== undefined && props.dpsMax !== undefined && ` (${props.dpsMin} - ${props.dpsMax})`}
                </Grid>}

            {props.FMin !== undefined && props.FMax !== undefined &&
                <Grid item xs={6} container alignItems="center">
                    <FaSkullCrossbones className={classes.statsIcon} />
                    {`${props.FMin} - ${props.FMax}`}
                </Grid>}

            {props.tAvg !== undefined &&
                <Grid item xs={6} container alignItems="center">
                    <FaRegClock className={classes.statsIcon} />
                    {`${props.tAvg}${pveStrings.s}`}
                    {props.tMin !== undefined && props.tMax !== undefined && ` (${props.tMin}${pveStrings.s} - ${props.tMax}${pveStrings.s})`}
                </Grid>}

            {props.ttwAvg &&
                <Grid item xs={6} container alignItems="center">
                    <FaRegHourglass className={classes.statsIcon} />
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

    ttwAvg: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

    FMin: PropTypes.number,
    FMax: PropTypes.number,
};