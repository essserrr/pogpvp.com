import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    boosted: {
        color: "rgb(211, 165, 14)",
    },
    marginLeft: {
        marginLeft: `${theme.spacing(0.5)}px`
    }
}));

const Counter = React.memo(function Counter(props) {
    const classes = useStyles();
    const difference = props.value - props.base;
    const valIsColored = props.colorForvalue && props.value > 0;

    return (
        <Grid container alignItems="center">

            {props.name}{":"}

            <b className={`${classes.marginLeft} ${valIsColored ? classes.boosted : ""}`}>
                {props.value}
            </b>

            {difference > 0 &&
                <b className={`${classes.marginLeft} ${classes.boosted}`}>
                    {" (+" + (props.toFixed ? difference.toFixed(props.decimal) : difference) + ")"}
                </b>}
        </Grid>
    )

});

export default Counter;

Counter.propTypes = {
    toFixed: PropTypes.bool,
    decimal: PropTypes.number,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

    base: PropTypes.number,

    name: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    colorForvalue: PropTypes.bool,
};