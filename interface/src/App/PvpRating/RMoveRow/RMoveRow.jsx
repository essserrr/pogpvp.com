import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import useAnimation from "css/hoverAnimation";
import ColoredMove from "App/Components/ColoredMove/ColoredMove";

const useStyles = makeStyles((theme) => ({
    rMove: {
        padding: `${theme.spacing(0.25)}px ${theme.spacing(0.5)}px`,
        backgroundColor: theme.palette.background.main,
        borderRadius: `${theme.spacing(0.5)}px`,
        border: "0.5px solid rgba(0, 0, 0, 0.295)",
        height: "fit-content",
        fontWeight: 400,
    }
}));

const RMoveRow = React.memo(function RMoveRow(props) {
    const classes = useStyles();
    const animation = useAnimation();

    function addStar(moveName) {
        return (props.pokemonTable[props.pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    return (
        <Grid container justify="space-between" alignItems="center" className={`${classes.rMove} ${animation.animation}`}>
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