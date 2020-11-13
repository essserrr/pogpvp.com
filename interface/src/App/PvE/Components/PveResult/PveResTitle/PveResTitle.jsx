import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const PveResTitle = React.memo(function PveResTitle(props) {
    return (
        <Grid container>
            <Typography variant="h6" align="center">
                {props.children}
            </Typography>
        </Grid>
    )
});

export default PveResTitle;

PveResTitle.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
};