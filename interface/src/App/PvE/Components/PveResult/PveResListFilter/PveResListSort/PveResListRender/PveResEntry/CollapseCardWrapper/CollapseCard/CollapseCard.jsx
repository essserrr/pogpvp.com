import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import GreyPaper from "App/Components/GreyPaper/GreyPaper";
import WeatherMoves from "../../WeatherMoves/WeatherMoves";

const CollapseCard = React.memo(function CollapseCard(props) {
    return (
        <GreyPaper enablePadding paddingMult={0.5} elevation={4}>
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