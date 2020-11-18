import React from "react";
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const HeadCell = React.memo(function HeadCell(props) {
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

export default HeadCell;

HeadCell.propTypes = {
    onClick: PropTypes.func.isRequired,

    isSelected: PropTypes.bool.isRequired,
    order: PropTypes.bool.isRequired,

    coltype: PropTypes.string,
    name: PropTypes.string,

    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
};