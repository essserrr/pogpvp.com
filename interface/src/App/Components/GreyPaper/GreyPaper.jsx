import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.main,
        flex: "0 0 100%",
        maxWidth: "100%",
    },
    padding: {
        padding: `${theme.spacing(3)}px`,
        [theme.breakpoints.down('md')]: {
            padding: `${theme.spacing(2)}px`,
        },
    }
}));

const GreyPaper = function GreyPaper(props) {
    const classes = useStyles();
    const { children, className, enablePadding, ...other } = props;

    return (
        <Paper className={`${classes.root} ${enablePadding ? classes.padding : ""} ${className}`} {...other}>
            {children}
        </Paper>
    );
}

export default GreyPaper;

GreyPaper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    enablePadding: PropTypes.bool,
    className: PropTypes.string,
};