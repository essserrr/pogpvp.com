import React from "react";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    descrText: {
        textAlign: "justify",
        textJustify: "inter-word",
    },
}));

const DescrBlock = React.memo(function DescrBlock(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.descrText}>
            {props.children}
        </Grid>
    )

});

export default DescrBlock;

DescrBlock.propTypes = {
    children: PropTypes.string,
};