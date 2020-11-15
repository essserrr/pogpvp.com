import React from "react";
import PropTypes from 'prop-types';

import { makeStyles, lighten } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    indicator: {
        position: "relative",
        width: "150px",
        height: "25px",
        backgroundColor: lighten("#808080", 0.75),
        border: "solid black",

        fontSize: "0.78rem",
        fontWeight: "bold",
    },

    indicatorBar: {
        position: "absolute",
        height: "100%",
        backgroundColor: "#02d86d",
        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",
    },

    indicatorText: {
        top: "50%",
        transform: "translateY(-50%)",
        position: "absolute",
        zIndex: "10",
        width: "100%",
        textAlign: "center",
        color: "black",
    },

}));

const HPIndicator = React.memo(function HPIndicator(props) {
    const classes = useStyles();
    const { maxValue } = props;
    const value = typeof props.value === "number" ? (props.value <= maxValue ? props.value : maxValue) : maxValue;

    return (
        <div className={classes.indicator}>
            <div className={classes.indicatorText}>
                {value}/{maxValue}
            </div>
            <div className={classes.indicatorBar} style={{ width: (value / maxValue * 100) + "%" }}></div>
        </div>
    )
});

export default HPIndicator;

HPIndicator.propTypes = {
    value: PropTypes.number,
    maxValue: PropTypes.number,
};