import React from "react";
import PropTypes from 'prop-types';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';

const Line = React.memo(function Line(props) {
    return (
        <TableRow>
            <TableCell component="th" style={{ maxWidth: "160px" }}>
                {props.title}
            </TableCell>
            <TableCell align="center">
                <Grid container justify="center">
                    {props.valueA}
                </Grid>
            </TableCell>
            <TableCell align="center">
                <Grid container justify="center">
                    {props.valueD}
                </Grid>
            </TableCell>
        </TableRow>
    )
});

export default Line;

Line.propTypes = {
    title: PropTypes.string,
    valueA: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    valueD: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
};