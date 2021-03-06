import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import Iconer from "App/Components/Iconer/Iconer";

const useStyles = props => makeStyles(theme => {
    return ({
        moveColor: {
            color: theme.palette.types[`type${props.type}`].text,
            backgroundColor: theme.palette.types[`type${props.type}`].background,
        },
        moveContainer: {
            fontWeight: "500",
            padding: `${theme.spacing(0.2)}px ${theme.spacing(0.5)}px ${theme.spacing(0.2)}px ${theme.spacing(0.5)}px`,
            borderRadius: "5px",
        },
    })
});

const ColoredMove = React.memo(function ColoredMove(props) {
    const { children, className, weather, type, ...other } = props;
    const { moveColor, moveContainer } = useStyles({ type: type })();

    return (
        <>
            {weather !== undefined &&
                <Iconer
                    folderName="/weather/"
                    fileName={weather}
                    size="24" />}
            <Box className={`${moveColor} ${moveContainer} ${className}`}  {...other} >
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
    ]).isRequired,
};