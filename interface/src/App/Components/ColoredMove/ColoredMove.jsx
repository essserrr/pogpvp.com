import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core/Box';

import Iconer from "../Iconer/Iconer";

const useStyles = makeStyles((theme) => ({
    moveColor: {
        color: props => theme.palette.types[`color${props.type}`].text,
        backgroundColor: props => theme.palette.types[`color${props.type}`].background,
    },
    moveContainer: {
        fontWeight: "400",
        padding: "0rem 0.2rem 0rem 0.2rem",
        borderRadius: "5px",
    },
    moveMargin: {
        margin: "0.2rem 0.2rem 0.2rem 0.2rem",
    },
}));

const ColoredMove = React.memo(function (props) {
    const { children, className, weather, type, ...other } = props;
    const classes = useStyles({type: type});

    return (
        <>
            {props.weather !== undefined &&
                <Iconer
                    folderName="/weather/"
                    fileName={props.weather}
                    size="18" />}
            <Box className={`${classes.moveColor} ${classes.moveContainer} ${className ? className : classes.moveMargin}`}  {...other}>
                {children}
            </Box >
        </>
    )
});

export default ColoredMove;


ColoredMove.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    className: PropTypes.string,
    weather: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    type: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};