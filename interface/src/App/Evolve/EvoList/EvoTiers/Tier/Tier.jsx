import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    separator: {
        display: "flex",
        alignItems: "center",
        textAlign: "center",

        "&::before": {
            marginRight: "0.25em",
            content: '""',
            flex: "1",
            borderBottom: `1px solid ${theme.palette.text.disabled}`,
        },
        "&::after": {
            marginLeft: "0.25em",
            content: '""',
            flex: "1",
            borderBottom: `1px solid ${theme.palette.text.disabled}`,
        },
    },
    separatorFont: {
        fontSize: "1.7rem",
        fontWeight: "600",
        color: "white",
        "-webkit-text-stroke": "1px black",
    },
}));

const Tier = React.memo(function Tier(props) {
    const classes = useStyles();
    const { title, children, childrenGrid, className, disableFont, ...other } = props;

    return (
        <Grid container justify="center" spacing={2}>
            {title &&
                <Grid item xs={12}
                    className={`${classes.separator} ${disableFont ? "" : classes.separatorFont} ${className}`}
                    {...other}>
                    {title}
                </Grid>}

            <Grid item xs={12} container justify="space-around" spacing={1} {...childrenGrid}>
                {children}
            </Grid>
        </Grid>
    )
});

export default Tier;

Tier.propTypes = {
    disableFont: PropTypes.bool,
    className: PropTypes.string,
    childrenGrid: PropTypes.object,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};