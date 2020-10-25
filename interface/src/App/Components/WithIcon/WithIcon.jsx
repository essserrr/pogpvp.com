import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
    iconMargin: {
        marginRight: "8px",
    },
    defaultIcon: {
        "&:hover": {
            fill: theme.palette.secondary.light,
        }
    }
}));

const WithIcon = React.memo(function WithIcon(props) {
    const classes = useStyles();

    return (
        <Grid container alignItems="center" justify="flex-start">
            <Grid item xs={"auto"} className={classes.iconMargin}>
                <Tooltip title={<Typography color="inherit">{!!props.tip ? props.tip : ""}</Typography>}>
                    {!!props.icon ? props.icon : <InfoIcon className={classes.defaultIcon} />}
                </Tooltip>
            </Grid>
            <Grid item xs>
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
    ]),
    tip: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.string,
    ]),
};