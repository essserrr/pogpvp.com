import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.background,
    },
}));

const GreyPaper = function GreyPaper(props) {
    const classes = useStyles();
    const { children, className, ...other } = props;

    return (
        <Paper className={`${classes.root} ${className}`} {...other}>
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
    className: PropTypes.string,
};