import React from "react";
import PropTypes from 'prop-types';

import ColoredMove from "App/Components/ColoredMove/ColoredMove";

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    rMove: {
        padding: `${theme.spacing(0.25)}px ${theme.spacing(0.5)}px`,
        backgroundColor: theme.palette.background.main,
        borderRadius: `${theme.spacing(0.5)}px`,
        border: "0.5px solid rgba(0, 0, 0, 0.295)",
        height: "fit-content",
        fontWeight: 400,

        position: "relative",
        "-webkit-transition": 'all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)',
        transition: "all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)",


        "&::after": {
            content: '""',
            borderRadius: `${theme.spacing(0.5)}px`,
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
            opacity: 0,
            "-webkit-transition": "all 0.15s linear",
            transition: "all 0.15s linear",
        },

        "&:hover": {
            "-webkit-transform": "scale(1.05, 1.05)",
            transform: "scale(1.05, 1.05)",
        },
        "&:hover::after": {
            opacity: 1,
            display: "block",
        },
    }
}));

const RMoveRow = React.memo(function RMoveRow(props) {
    const classes = useStyles();

    function addStar(moveName) {
        return (props.pokemonTable[props.pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    return (
        <Grid container justify="space-between" alignItems="center" className={classes.rMove}>
            <Grid item container xs>
                {props.moveTable[props.value.Quick] &&
                    <ColoredMove m={0.25} type={props.moveTable[props.value.Quick].MoveType}>
                        {props.value.Quick + addStar(props.value.Quick)}
                    </ColoredMove>}
                {props.moveTable[props.value.Charge[0]] &&
                    <ColoredMove m={0.25} type={props.moveTable[props.value.Charge[0]].MoveType}>
                        {props.value.Charge[0] + addStar(props.value.Charge[0])}
                    </ColoredMove>}
                {props.moveTable[props.value.Charge[1]] &&
                    <ColoredMove m={0.25} type={props.moveTable[props.value.Charge[1]].MoveType}>
                        {props.value.Charge[1] + addStar(props.value.Charge[1])}
                    </ColoredMove>}
            </Grid>
            <Grid item xs="auto">
                {props.value.Rate}
            </Grid>
        </Grid>
    )
});

export default RMoveRow;

RMoveRow.propTypes = {
    pokName: PropTypes.string,
    value: PropTypes.object,
    moveTable: PropTypes.object,
    pokemonTable: PropTypes.object,
};