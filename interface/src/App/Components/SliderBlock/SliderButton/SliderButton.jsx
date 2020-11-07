import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    sliderButton: {
        flexBasis: "0",
        flexGrow: "1",
        maxWidth: "100%",

        position: "relative",
        lineHeight: "inherit",

        backgroundColor: "transparent",

        color: theme.palette.text.main,
        fontWeight: 400,


        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",

        "&[toggled=true]": {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            outline: "none",
        },

        "&:focus": {
            outline: "none",
        },
    }
}));

const SliderButton = React.memo(function SliderButton(props) {
    const classes = useStyles();
    const { className, attr, onClick, children, ...other } = props;

    return (
        <button
            className={`${classes.sliderButton} ${className ? className : ""}`}
            attr={attr}
            onClick={onClick}
            {...other}
        >
            {children}
        </button>
    )
});

export default SliderButton;

SliderButton.propTypes = {
    className: PropTypes.string,
    attr: PropTypes.string,

    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ])
};