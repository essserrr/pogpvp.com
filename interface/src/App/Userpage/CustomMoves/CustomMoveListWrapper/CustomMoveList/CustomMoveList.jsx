import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import CustomMove from "./CustomMove/CustomMove";

const useStyles = makeStyles((theme) => ({
    list: {
        display: "inline-flex",
        overflowX: "auto",
        overflowY: "hidden",
        "&>div": {
            margin: "4px",
        },
    },
}));

const CustomMoveList = React.memo(function CustomMoveList(props) {
    const classes = useStyles();

    return (
        <Grid item xs={12} className={classes.list}>
            {props.children.map((move, i) =>
                <CustomMove number={i} move={move} key={i}
                    onMoveOpen={props.onMoveOpen}
                    onMoveDelete={props.onMoveDelete}
                />)}
        </Grid>
    )
});

export default CustomMoveList;

CustomMoveList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    onMoveOpen: PropTypes.func,
    onMoveDelete: PropTypes.func,
};