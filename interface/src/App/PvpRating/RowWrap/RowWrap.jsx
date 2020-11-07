import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    title: {
        borderBottom: `0.5px solid ${theme.palette.text.primary}`,
        fontSize: "1.1em",
        fontWeight: 400,
        margin: `${theme.spacing(2)}px 0 ${theme.spacing(2)}px 0`,
    },
}));

const RowWrap = React.memo(function RowWrap(props) {
    const { title, disableIcon, children, ...other } = props
    const classes = useStyles();

    return (
        <Grid item {...other}>
            <Grid container justify="center">
                <Grid container item xs={12} justify={!disableIcon ? "space-between" : "center"} alignItems="center" className={classes.title}>
                    {title}{!disableIcon && <i className="fas fa-trophy"></i>}
                </Grid>
                <Divider />
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