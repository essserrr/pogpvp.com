import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

import { returnRateStyle } from "js/Rate/returnRateStyle";

const useStyles = props => makeStyles(theme => {
    return ({
        singleCell: {
            display: "inline-block",
            width: "fit-content",

            padding: "0px 5px",
            borderRadius: "4px",
            border: "1px solid black",

            fontSize: "13px",
            fontWeight: "bold",

            backgroundColor: theme.palette.rating[`rate${props.value}`].background,
            color: theme.palette.rating[`rate${props.value}`].text,

            "&:hover": {
                userSelect: "none",
                color: theme.palette.text.primary,
                backgroundColor: "white !important",
            }
        }
    })
});

const TableIcon = function TableIcon(props) {
    const classes = useStyles({ value: returnRateStyle(props.rate)[1] })();

    return (
        <TableCell align="center" style={{ verticalAlign: 'center' }}>
            <Link className={classes.singleCell}
                to={{ pathname: props.query, state: { needsUpdate: true } }}>
                {props.rate}
            </Link>
        </TableCell>
    )
};


export default TableIcon;

TableIcon.propTypes = {
    rate: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
};