import React from "react";
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles(theme => {
    let style = {
        root: {
            verticalAlign: "middle",
            textAlign: "center",
        },
    }

    switch (props.eventType) {
        case "sword":
            style.cell = {
                "& svg": {
                    width: "11px",
                    height: "11px",
                    "-webkit-transition": "all 0.1s linear",
                    transition: "all 0.1s linear",

                    fill: theme.palette.types[`type${props.moveType}`].background,

                    "&:hover": {
                        "-webkit-transform": "scale(1.3, 1.3)",
                        transform: "scale(1.3, 1.3)",
                    },
                },
            }
            break
        case "dsword":
            style.cell = {
                "& svg": {
                    width: "20px",
                    height: "20px",
                    "-webkit-transition": "all 0.1s linear",
                    transition: "all 0.1s linear",

                    fill: theme.palette.types[`type${props.moveType}`].background,

                    filter: props.glow ? theme.palette.glow[props.glow] : "none",

                    "&:hover": {
                        "-webkit-transform": "scale(1.15, 1.15)",
                        transform: "scale(1.15, 1.15)",
                    }
                },
            }
            break
        case "shield":
            style.cell = {
                "& svg": {
                    fill: "rgb(0, 0, 0)",
                    width: "20px",
                    height: "20px",

                    "-webkit-transition": "all 0.1s linear",
                    transition: "all 0.1s linear",
                    "&hover ": {
                        "-webkit-transform": "scale(1.15, 1.15)",
                        transform: "scale(1.15, 1.15)",
                    },
                },
            }
            break
        case "faint":
            style.cell = {
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "red",
            }
            break
        case "idle":
            style.cell = {
                //margin: "auto",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "grey",

                "-webkit-transition": "all 0.1s linear",
                transition: "all 0.1s linear",
                "&:hover": {
                    "-webkit-transform": "scale(1.5, 1.5)",
                    transform: "scale(1.5, 1.5)",
                }
            }
            break
        default:
            style.cell = {}
            break
    }

    return style;
});


const Event = function Event(props) {
    const { moveType, eventType, glow, id, onclick, children, onMouseEnter } = props;
    const classes = useStyles({ moveType, eventType, glow })();

    return (
        <td onMouseEnter={onMouseEnter} onClick={onclick} id={id} className={classes.root} >
            <Tooltip arrow placement="top" title={<Typography>{props.tip}</Typography>}>
                <div className={classes.cell} >
                    {children}
                </div>
            </Tooltip>
        </td >
    )
};

export default Event;

Event.propTypes = {
    onMouseEnter: PropTypes.func,
    onclick: PropTypes.func,

    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),

    className: PropTypes.string,
    tip: PropTypes.node,
    for: PropTypes.string,
};