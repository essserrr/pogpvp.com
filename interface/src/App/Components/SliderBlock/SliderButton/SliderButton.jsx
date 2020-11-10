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


        borderColor: lighten(theme.palette.primary.main, 0.3),
        borderWidth: "2px 0px 2px 0px",
        borderStyle: "solid",

        color: theme.palette.text.main,
        fontWeight: 400,

        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",

        "&[toggled=true]": {
            borderColor: theme.palette.secondary.main,
            outline: "none",

            "&::after": {
                zIndex: 2,
                borderColor: theme.palette.secondary.main,
            },

            "&::before": {
                zIndex: 2,
                borderColor: theme.palette.secondary.main,
            },
        },

        "&:focus": {
            outline: "none",
        },


        "&::after": {
            content: '""',
            display: "block",
            position: "absolute",

            height: "calc(100% + 4px)",

            top: -2,
            right: -1,

            borderRight: `2px solid ${lighten(theme.palette.primary.main, 0.3)}`,

            "-webkit-transition": "all 0.4s linear",
            transition: "all 0.4s linear",
        },

        "&::before": {
            content: '""',
            display: "block",
            position: "absolute",

            height: "calc(100% + 4px)",

            top: -2,
            left: -1,

            borderLeft: `2px solid ${lighten(theme.palette.primary.main, 0.3)}`,

            "-webkit-transition": "all 0.4s linear",
            transition: "all 0.4s linear",
        },
    },


    buttonSpacing: {
        paddingLeft: "5px",
        paddingRight: "5px",

        paddingTop: "4px",
        paddingBottom: "4px",

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