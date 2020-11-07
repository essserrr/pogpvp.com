import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    title: {
        borderBottom: `0.5px solid ${theme.palette.text.primary}`,
        fontSize: "1.1em",
        fontWeight: 400,
    },
}));

const RowWrap = React.memo(function RowWrap(props) {
    const { title, disableIcon, children, ...other } = props
    const classes = useStyles();

    return (
        <Grid item {...other}>
            <Grid container justify="center" spacing={2}>
                <Grid container item xs={12} justify={!disableIcon ? "space-between" : "center"} className={classes.title}>
                    {title}{!disableIcon && <i className="fas fa-trophy"></i>}
                </Grid>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Grid>
    )
});

export default RowWrap;

RowWrap.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    disableIcon: PropTypes.bool,
    children: PropTypes.node,
};