import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const PanelWithTitle = React.memo(function PanelWithTitle(props) {
    const { title, children, ...other } = props;

    return (
        <Grid container spacing={2} {...other}>
            {title &&
                <Grid item xs={12}>
                    <Typography variant="h6" align="center">
                        {title}
                    </Typography>
                </Grid>}
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
    )
});

export default PanelWithTitle;

PanelWithTitle.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};