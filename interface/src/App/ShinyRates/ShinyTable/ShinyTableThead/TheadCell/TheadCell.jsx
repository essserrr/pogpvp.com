import React from "react";
import propTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const TheadCell = React.memo(function TheadCell(props) {
    const { isSelected, order, coltype, name, children, onClick, ...other } = props;

    return (
        <TableCell component="th"
            sortDirection={isSelected ? (order ? 'desc' : 'asc') : 'asc'}
            onClick={(event, ...other) => onClick(event, { coltype: coltype, name: name }, ...other)}
            {...other}
        >
            <TableSortLabel active={isSelected} direction={isSelected ? (order ? 'desc' : 'asc') : 'asc'}>
                {children}
            </TableSortLabel>
        </TableCell>
    )
});

export default TheadCell;

TheadCell.propTypes = {
    onClick: propTypes.func.isRequired,

    isSelected: propTypes.bool.isRequired,
    order: propTypes.bool.isRequired,

    coltype: propTypes.string,
    name: propTypes.string,

    children: propTypes.oneOfType([
        propTypes.node,
        propTypes.string,
    ]).isRequired,
};