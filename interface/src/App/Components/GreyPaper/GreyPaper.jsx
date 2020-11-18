import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = props => makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.main,
        flex: "0 0 100%",
        maxWidth: "100%",
    },
    padding: {
        padding: `${theme.spacing(3 * props.paddingMult)}px`,
        [theme.breakpoints.down('md')]: {
            padding: `${theme.spacing(2 * props.paddingMult)}px`,
        },
    }
})
);

const GreyPaper = function GreyPaper(props) {
    const { children, className, enablePadding, paddingMult, ...other } = props;
    const classes = useStyles({ paddingMult: paddingMult ? paddingMult : 1 })();



    return (
        <Paper className={`${classes.root} ${enablePadding ? classes.padding : ""} ${className}`} {...other}>
            {children}
        </Paper>
    );
}

export default GreyPaper;

GreyPaper.propTypes = {
    paddingMult: PropTypes.number,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    enablePadding: PropTypes.bool,
    className: PropTypes.string,
};