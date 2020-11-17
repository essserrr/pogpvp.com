import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { returnRateStyle } from "js/indexFunctions.js";

const useStyles = props => makeStyles(theme => {
    return ({
        root: {
            minWidth: "70px",
            verticalAlign: 'center'
        },
        col4: {
            position: "relative",
            width: "100%",
            flex: "0 0 33.333333%",
            maxWidth: "33.333333%",
        },
        tripleContainer: {
            fontWeight: "500",
            minWidth: "70px",
            maxWidth: "80px",
            border: "1.5px solid #42434e",
            borderRadius: "3px",
            overflow: "hidden",

            textAign: "center",

            "& a:first-child": {
                borderRight: "1.5px solid #42434e",
                backgroundColor: theme.palette.rating[`rate${props.rate00}`].background,
                color: theme.palette.rating[`rate${props.rate00}`].text,
                "&:hover": {
                    backgroundColor: "white !important",
                },
            },

            "& a:nth-child(2)": {
                borderRight: "1.5px solid #42434e",
                backgroundColor: theme.palette.rating[`rate${props.rate11}`].background,
                color: theme.palette.rating[`rate${props.rate11}`].text,
                "&:hover": {
                    backgroundColor: "white !important",
                },
            },

            "& a:nth-child(3)": {
                backgroundColor: theme.palette.rating[`rate${props.rate22}`].background,
                color: theme.palette.rating[`rate${props.rate22}`].text,
                "&:hover": {
                    backgroundColor: "white !important",
                },
            },

            "& div:last-child": {
                borderTop: "1.5px solid #42434e",
                userSelect: "none",
                backgroundColor: theme.palette.rating[`rate${props.rateOverall}`].background,
                color: theme.palette.rating[`rate${props.rateOverall}`].text,
            },

        },
    })
});

const PvpTripleCell = function PvpTripleCell(props) {
    const rate00 = returnRateStyle(props.rate0)[1]
    const rate11 = returnRateStyle(props.rate1)[1]
    const rate22 = returnRateStyle(props.rate2)[1]
    const rateOverall = returnRateStyle(props.overallRating)[1]

    const classes = useStyles({ rate00, rate11, rate22, rateOverall })();

    return (
        <TableCell align="center" className={classes.root} >

            <Grid container justify="center" align="center">

                <Grid item xs="auto" container className={classes.tripleContainer}>
                    <Link className={classes.col4}
                        to={{ pathname: props.queries[0], state: { needsUpdate: true } }}>
                        {rate00[0]}
                    </Link>
                    <Link className={classes.col4}
                        to={{ pathname: props.queries[1], state: { needsUpdate: true } }}>
                        {rate11[0]}
                    </Link>
                    <Link className={classes.col4}
                        to={{ pathname: props.queries[2], state: { needsUpdate: true } }}>
                        {rate22[0]}
                    </Link>
                    <Grid item xs={12}>
                        {props.overallRating}
                    </Grid>
                </Grid>


            </Grid>

        </TableCell>
    )
};

export default PvpTripleCell;

PvpTripleCell.propTypes = {
    rate0: PropTypes.number.isRequired,
    rate1: PropTypes.number.isRequired,
    rate2: PropTypes.number.isRequired,
    overallRating: PropTypes.number.isRequired,
    queries: PropTypes.arrayOf(PropTypes.string).isRequired,
};