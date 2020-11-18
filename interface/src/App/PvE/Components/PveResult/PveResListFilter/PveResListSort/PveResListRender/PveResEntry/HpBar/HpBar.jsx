import React from "react";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    bound: {
        position: "absolute",
        height: "100%",
        borderLeft: "2px solid red",
        borderRight: "2px solid red",
        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",

        background: "repeating-linear-gradient(45deg, #606cbc00, #606cbc00 2px, red 2px, red 4px)",
    },

    background: {
        position: "relative",
        maxWidth: "400px",
        height: "6px",
        backgroundColor: "grey",

        overflow: "hidden",
        borderRadius: "4px",
    },

    front: {
        position: "absolute",
        height: "100%",
        backgroundColor: "#02d86d",
        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",

    },
}));

const HpBar = React.memo(function HpBar(props) {
    const classes = useStyles();

    return (
        <Box className={classes.background}>
            <Box className={classes.front} style={{ width: props.avg + "%" }}></Box>
            <Box className={classes.bound} style={{ left: props.low + "%", width: props.up - props.low + "%" }}></Box>
        </Box>
    )
});

export default HpBar;

HpBar.propTypes = {
    up: PropTypes.string,
    low: PropTypes.string,
    avg: PropTypes.string,
};