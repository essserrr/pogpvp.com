import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { weather } from "js/bases/weather";
import Iconer from "App/Components/Iconer/Iconer";

const useStyles = makeStyles((theme) => ({
    marginLeft: {
        marginLeft: `${theme.spacing(0.75)}px`
    },
}));

const WeatherBoosted = React.memo(function WeatherBoosted(props) {
    const classes = useStyles();

    return (
        Object.keys(weather[props.weather]).map((value) =>
            <Iconer key={value} folderName="/type/" fileName={String(value)} size={18} className={classes.marginLeft} />
        )
    )
});

export default WeatherBoosted;

WeatherBoosted.propTypes = {
    weather: PropTypes.string,
};