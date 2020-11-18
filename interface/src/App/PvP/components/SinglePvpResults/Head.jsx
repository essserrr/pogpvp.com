import React from "react";
import PropTypes from 'prop-types';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const Head = React.memo(function Head(props) {
    return (
        <TableHead>
            <TableRow>
                <TableCell component="th" scope="col"></TableCell>
                <TableCell component="th" scope="col" align="center">{props.NameA}</TableCell>
                <TableCell component="th" scope="col" align="center">{props.NameD}</TableCell>
            </TableRow>
        </TableHead>
    )
});

export default Head;

Head.propTypes = {
    NameA: PropTypes.string,
    NameD: PropTypes.string,
};