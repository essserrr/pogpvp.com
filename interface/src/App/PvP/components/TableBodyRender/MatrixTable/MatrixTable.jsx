import React from "react";
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles(theme => {
    return ({
        table: {
            "& thead": {
                "& tr": {
                    "& th": {
                        backgroundColor: theme.palette.background[props.variant],
                        padding: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
                        fontWeight: "bold",
                    },
                },
            },
            "& tbody": {
                "& tr": {
                    "& th": {
                        position: '-webkit-sticky',
                        // eslint-disable-next-line
                        position: 'sticky',
                        backgroundColor: theme.palette.background[props.variant],
                        left: 0,
                        zIndex: 1,

                        padding: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
                        fontWeight: "bold",
                    },
                    "& td": {
                        padding: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
                    },
                },
            },
        },
    })
});

const MatrixTable = React.memo(function MatrixTable(props) {
    const classes = useStyles({ variant: props.variant ? props.variant : "main" })();

    return (
        <Table stickyHeader className={classes.table}>
            <TableHead>
                <TableRow>
                    {props.children[0]}
                </TableRow>
            </TableHead>
            <TableBody>
                {props.children.slice(1).map((elem, i) =>
                    <TableRow key={"tableline" + i}>
                        {elem}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
});

export default MatrixTable;

MatrixTable.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    variant: PropTypes.string,
};
