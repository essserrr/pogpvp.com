import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { returnVunStyle } from "js/Rate/returnVunStyle";
import { returnRateStyle } from "js/Rate/returnRateStyle";

const useStyles = props => makeStyles(theme => {
    return ({
        rate: {
            paddingLeft: "5px",
            paddingRight: "5px",
            marginTop: "5px",
            marginBottom: "5px",

            display: "inline-block",
            width: "fit-content",
            borderRadius: "4px",

            border: "1px solid black",

            fontWeight: "bold",

            backgroundColor: theme.palette.rating[`rate${props.value}`].background,
            color: theme.palette.rating[`rate${props.value}`].text,
        },
    })
});

const Rate = React.memo(function Rate(props) {
    const classes = useStyles(
        {
            value: props.forMult ?
                returnVunStyle(props.reverse ?
                    props.value === "1.000" ? props.value : (1 / props.value).toFixed(3)
                    :
                    props.value)
                :
                returnRateStyle(props.value)[1]
        }
    )();

    return (
        <Box className={classes.rate}>
            {props.children && <Box clone mr={1}>
                {props.children}
            </Box>}
            {props.value}
        </Box>
    )
});

export default Rate;

Rate.propTypes = {
    children: PropTypes.node,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    forMult: PropTypes.bool,
    reverse: PropTypes.bool,
};