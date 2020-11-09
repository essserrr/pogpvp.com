import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';

const TableWithTitle = React.memo(function TableWithTitle(props) {
    const { title, children } = props;

    return (
        <Grid container justify="center" spacing={1}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" align="center">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Table>
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