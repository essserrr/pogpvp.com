import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
    mainCell: {
        fontWeight: 500,
        textTransform: "uppercase",
    },
}));

const InfoTable = React.memo(function InfoTable(props) {
    const classes = useStyles();

    return (
        <TableContainer>
            <Table className={classes.table}>
                <TableBody>
                    {props.children.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell className={classes.mainCell} component="th" scope="row">{row.name}</TableCell>
                            <TableCell align="center">{row.info}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default InfoTable;

InfoTable.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
                info: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
            })
        ),
    ]),
};
