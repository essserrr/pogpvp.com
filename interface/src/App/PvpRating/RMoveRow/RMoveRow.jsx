import React from "react"
import ColoredMove from "../../Components/ColoredMove/ColoredMove"

import "./RMoveRow.scss"

const RMoveRow = React.memo(function (props) {
    function addStar(moveName) {
        return (props.pokemonTable[props.pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    return (
        <div className="rating-moverow row justify-content-between mb-1 mx-2 mx-md-3">
            <div className="col p-0">
                <div className="row justify-content-md-left m-0 p-0">
                    {props.moveTable[props.value.Quick] &&
                        <ColoredMove m={0.5}
                            type={props.moveTable[props.value.Quick].MoveType}
                        >
                            {props.value.Quick + addStar(props.value.Quick)}
                        </ColoredMove>}
                    {props.moveTable[props.value.Charge[0]] &&
                        <ColoredMove m={0.5}
                            type={props.moveTable[props.value.Charge[0]].MoveType}
                        >
                            {props.value.Charge[0] + addStar(props.value.Charge[0])}
                        </ColoredMove>}
                    {props.moveTable[props.value.Charge[1]] &&
                        <ColoredMove m={0.5}
                            type={props.moveTable[props.value.Charge[1]].MoveType}
                        >
                            {props.value.Charge[1] + addStar(props.value.Charge[1])}
                        </ColoredMove>}
                </div>
            </div>
            <div className="col-auto text-right align-self-center p-0 pr-2">
                {props.value.Rate}
            </div>
        </div>
    )
});

export default RMoveRow;