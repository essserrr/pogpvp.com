import React from 'react';
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

const ErrorSum = React.memo(function ErrorSum(props) {
    const { children, ...other } = props;

    return (
        <Alert variant="filled" severity="error" {...other}>
            <Grid container justify="center" spacing={1}>
                {Object.values(children).reduce((sum, val, index) => {
                    sum.push(<Grid item xs={12} key={index}>{val}</Grid>)
                    return sum
                }, [])}
            </Grid>
        </Alert >
    );
});

export default ErrorSum;

ErrorSum.propTypes = {
    children: PropTypes.object,
};