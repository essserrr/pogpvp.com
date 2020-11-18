import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const HorizontalTypeList = React.memo(function HorizontalTypeList(props) {

    return (
        <Grid container spacing={1}>

            <Grid item xs={12}>
                <Typography align="center" variant="h6">
                    {props.title}
                </Typography>
            </Grid>

            <Grid item xs={12} container alignItems="center" spacing={1}>
                {props.firstLineTitle}
                {Array.isArray(props.firstLine) ?
                    props.firstLine.map(vale => <Grid item xs="auto">{vale}</Grid>)
                    :
                    props.firstLine}
            </Grid>
            <Grid item xs={12} container alignItems="center" spacing={1}>
                {props.secondLineTitle}
                {Array.isArray(props.secondLine) ?
                    props.secondLine.map(vale => <Grid item xs="auto">{vale}</Grid>)
                    :
                    props.secondLine}
            </Grid>

        </Grid>
    )
});

export default HorizontalTypeList;

HorizontalTypeList.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    firstLineTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    secondLineTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    firstLine: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    secondLine: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};