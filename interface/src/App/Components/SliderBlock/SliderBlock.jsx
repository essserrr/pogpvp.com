import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    sliderGroup: {
        overflow: "hidden",
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: `${theme.spacing(0.5)}px`,

        "-webkit-transition": "all 0.4s linear",
        transition: "all 0.4s linear",

        "& $buttonBorder:last-of-type": {
            border: "none !important",
        }
    },

    buttonBorder: {
        borderWidth: "0px 2px 0px 0px",
        border: `solid ${theme.palette.primary.main}`,
    }
}));

const SliderBlock = React.memo(function SliderBlock(props) {
    const classes = useStyles();
    const { className, children, ...other } = props;

    return (

        <Grid container justify="center"
            className={`${classes.sliderGroup} ${className ? className : ""}`} {...other}>

            {children.map((value, key) => {
                const { className } = value.props

                return React.cloneElement(value, {
                    key: key,
                    className: `${classes.buttonBorder} ${className ? className : ""}`,
                })
            })}

        </Grid>
    )

});

export default SliderBlock;

SliderBlock.propTypes = {
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};