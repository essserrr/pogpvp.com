import React from "react";
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cell: {
        verticalAlign: "middle",
        textAlign: "center",
    },
}));


const Event = function Event(props) {
    const classes = useStyles();

    return (
        <td onMouseEnter={props.onMouseEnter} id={props.for} className={classes.cell}>
            <Tooltip arrow placement="top" title={<Typography>{props.tip}</Typography>}>
                <div onClick={props.onclick} className={props.className} id={props.for} >
                    {props.children}
                </div>
            </Tooltip>
        </td>
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