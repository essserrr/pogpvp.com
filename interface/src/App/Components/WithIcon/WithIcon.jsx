import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
    iconMargin: {
        marginRight: "8px",
    },
}));

const WithIcon = React.memo(function WithIcon(props) {
    const classes = useStyles();

    return (
        <Grid container alignItems="center" justify="flex-start">
            <Grid item className={classes.iconMargin}>
                <Tooltip title={!!props.tip ? props.tip : ""}>
                    {!!props.icon ? props.icon : <InfoIcon />}
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                {props.children}
            </Grid>
        </Grid>
    );
});

export default WithIcon;

WithIcon.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
    icon: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
    tip: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.string,
    ]),
};