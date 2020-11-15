import React from "react";
import PropTypes from 'prop-types';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const Line = React.memo(function Line(props) {
    return (
        <TableRow>
            <TableCell component="th">{props.title}</TableCell>
            <TableCell>{props.valueA}</TableCell>
            <TableCell>{props.valueD}</TableCell>
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