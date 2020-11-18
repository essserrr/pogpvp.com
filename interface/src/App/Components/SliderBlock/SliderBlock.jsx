import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    sliderGroup: {
        overflow: "hidden",
        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",

        "& button:first-child": {
            borderRadius: "4px 0px 0px 4px",
            borderWidth: "2px 0px 2px 2px",
            "&::before": {
                display: "none",
            },
        },
        "& button:last-child": {
            borderRadius: "0px 4px 4px 0px",
            borderWidth: "2px 2px 2px 0px",
            "&::after": {
                display: "none",
            },
        },
    },
}));

const SliderBlock = React.memo(function SliderBlock(props) {
    const classes = useStyles();
    const { className, children, ...other } = props;

    return (

        <Grid container justify="center"
            className={`${classes.sliderGroup} ${className ? className : ""}`} {...other}>
            {children}
        </Grid>
    )

});

export default SliderBlock;

SliderBlock.propTypes = {
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};