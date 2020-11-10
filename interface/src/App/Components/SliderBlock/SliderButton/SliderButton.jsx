import React from "react";
import PropTypes from 'prop-types';

import { lighten, makeStyles } from '@material-ui/core/styles';

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
            backgroundColor: lighten(theme.palette.primary.main, 0.3),
            outline: "none",
        },

        "&:focus": {
            outline: "none",
        },
    },
    buttonSpacing: {
        paddingLeft: "5px",
        paddingRight: "5px",

        "@media (max-width: 768px)": {
            paddingLeft: "2px",
            paddingRight: "2px",
        },
        "@media (max-width: 576px)": {
            paddingLeft: "1px",
            paddingRight: "1px",
        },
    },
}));

const SliderButton = React.memo(function SliderButton(props) {
    const classes = useStyles();
    const { className, attr, onClick, children, toggled, ...other } = props;

    return (
        <button
            className={`${classes.sliderButton} ${classes.buttonSpacing} ${className ? className : ""}`}
            attr={attr}
            toggled={String(toggled)}
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
    toggled: PropTypes.bool.isRequired,

    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ])
};