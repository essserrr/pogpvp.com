import React from "react"
import ShortMove from "./ShortMove/ShortMove"

const RMoveRow = React.memo(function (props) {
    function addStar(moveName) {
        return (props.pokemonTable[props.pokName].EliteMoves[moveName] === 1 ? "*" : "")

    }

    return (
        <div className="row justify-content-between styleRating fBolder animRating mb-1 mx-2 mx-md-3">
            <div className="col p-0">
                <div className="row justify-content-md-left m-0 p-0">
                    {props.moveTable[props.value.Quick] &&
                        <ShortMove
                            enableMargins={true}
                            class={`typeColorC${props.moveTable[props.value.Quick].MoveType} text`}
                            value={props.value.Quick + addStar(props.value.Quick)}
                        />}
                    {props.moveTable[props.value.Charge[0]] &&
                        <ShortMove
                            enableMargins={true}
                            class={`typeColorC${props.moveTable[props.value.Charge[0]].MoveType} text`}
                            value={props.value.Charge[0] + addStar(props.value.Charge[0])}
                        />}
                    {props.moveTable[props.value.Charge[1]] &&
                        <ShortMove
                            enableMargins={true}
                            class={`typeColorC${props.moveTable[props.value.Charge[1]].MoveType} text`}
                            value={props.value.Charge[1] + addStar(props.value.Charge[1])}
                        />}
                </div>
            </div>
            <div className="col-auto text-right align-self-center p-0 pr-2">
                {props.value.Rate}
            </div>
        </div>
    )
});

export default RMoveRow;