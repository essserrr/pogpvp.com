import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { getCookie } from "js/getCookie";
import { moveTips } from "locale/Pvp/MoveTips/MoveTips";

const useStyles = props => makeStyles(theme => {
    return ({
        indicator: {
            position: "relative",
            width: "34px",
            height: "34px",
            backgroundColor: "rgba(6, 20, 54, 0.18)",

            zIndex: "2",

            overflow: "hidden",

            border: "1.5px solid black",
            borderRadius: "50%",

            fontSize: "0.78rem",
            color: "white",
            fontWeight: "bold",

            "-webkit-transition": "all 0.4s linear",
            transition: "all 0.4s linear",

            boxShadow: props.fullyCharged ?
                `0px 0px 0 ${theme.palette.types[`type${props.type}`].background},
            0px 0px 4px ${theme.palette.types[`type${props.type}`].background},
            0px 0px 8px ${theme.palette.types[`type${props.type}`].background},
            0px 0px 16px ${theme.palette.types[`type${props.type}`].background}`
                : "none",
        },

        indicatorBar: {
            position: "absolute",
            width: "100%",
            "-webkit-transition": "all 0.4s linear",
            transition: "all 0.4s linear",

            zIndex: 1,

            marginTop: "100%",
            transform: "rotatex(180deg)",
            transformOrigin: "top",

            backgroundColor: `${theme.palette.types[`type${props.type}`].background}`
        },

        indicatorText: {
            top: "50%",
            transform: "translateY(-50%)",
            position: "absolute",
            zIndex: "10",
            width: "100%",
            textAlign: "center",
            userSelect: "none",

            color: `${theme.palette.types[`type${props.type}`].text}`,
        },
    })
});

let moveStrings = new LocalizedStrings(moveTips);

const EnergyIndicator = React.memo(function EnergyIndicator(props) {
    moveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    const { damage, maxValue, move } = props;
    const defaultValue = 0;
    const value = typeof props.value === "number" ? (props.value <= maxValue ? props.value : maxValue) : defaultValue;

    const fullyCharged = value >= maxValue;

    const classes = useStyles({ fullyCharged, type: move.MoveType })();

    return (
        <Tooltip arrow placement="top" title={
            <Typography>
                {`${moveStrings.move.damage}: ${damage}`}<br />
                {`${moveStrings.move.energy}: ${-move.PvpEnergy}`}<br />
                {`DPE: ${(damage / -move.PvpEnergy).toFixed(2)}`}
            </Typography>}>

            <Box className={classes.indicator}>

                <Box className={classes.indicatorText}>
                    {move.Title.replace(/[a-z -]/g, "")}
                </Box>

                <Box className={classes.indicatorBar} style={{ height: `${value / maxValue * 100}%` }}>

                </Box>
            </Box>
        </Tooltip>
    )
});

export default EnergyIndicator;

EnergyIndicator.propTypes = {
    value: PropTypes.number,
    maxValue: PropTypes.number,
    move: PropTypes.object,
    damage: PropTypes.number,
};