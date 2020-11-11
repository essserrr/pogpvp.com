import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Move from "./Move";

const MoveCol = React.memo(function MoveCol(props) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="h6">
                    {props.title}
                </Typography>
            </Grid>
            {props.value.map((elem) =>
                <Grid item xs={12} key={elem}>
                    <Move value={props.moveTable[elem]} pok={props.pok} />
                </Grid>)}
        </Grid>
    )
});

export default MoveCol;

MoveCol.propTypes = {
    value: PropTypes.array,
    moveTable: PropTypes.object,
    title: PropTypes.string,
    pok: PropTypes.object,
};