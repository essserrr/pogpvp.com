import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import GreyPaper from "App/Components/GreyPaper/GreyPaper";
import WeatherMoves from "../../WeatherMoves/WeatherMoves";

const useStyles = makeStyles((theme) => ({
    border: {
        border: "1px solid rgba(0, 0, 0, 0.295)",
    }
}));

const CollapseCard = React.memo(function CollapseCard(props) {
    const classes = useStyles();

    return (
        <GreyPaper enablePadding paddingMult={0.5} elevation={2} className={classes.border}>
            <Grid container spacing={1}>
                <Grid item xs={12} container alignItems="center">
                    <WeatherMoves
                        pokQick={props.pokQick}
                        pokCh={props.pokCh}
                        weather={props.weather}
                    />
                </Grid>
                <Grid item xs={12}>
                    {props.children}
                </Grid>
            </Grid>
        </GreyPaper>
    )
});

export default CollapseCard;

CollapseCard.propTypes = {
    bounds: PropTypes.object,
    remain: PropTypes.object,
    stats: PropTypes.object,
    disableCollapse: PropTypes.bool,
};