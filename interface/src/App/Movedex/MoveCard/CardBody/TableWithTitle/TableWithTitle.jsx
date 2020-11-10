import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    table: {
        "& td": {
            padding: `${theme.spacing(1)}px`,
        },
        "& th": {
            padding: `${theme.spacing(1)}px`,
        },
    },
}));

const TableWithTitle = React.memo(function TableWithTitle(props) {
    const { title, children } = props;
    const classes = useStyles();

    return (
        <Grid container justify="center" >
            <Grid item xs={12}>
                <Typography variant="h6" align="left">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Table className={classes.table}>
                    <TableBody>
                        {children}
                    </TableBody>
                </Table>
            </Grid>
        </Grid>
    )

});

export default TableWithTitle;

TableWithTitle.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.node),
};