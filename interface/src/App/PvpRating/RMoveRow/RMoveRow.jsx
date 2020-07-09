import React from "react";

const RMoveRow = React.memo(function (props) {
    return (
        <div className="row justify-content-between styleRating fBolder animRating mb-1 mx-2 mx-md-3">
            <div className="col p-0">
                <div className="row justify-content-md-left m-0 p-0">
                    {props.moveTable[props.value.Quick] &&
                        <div className={"mx-1 moveStyle m typeColorC" + props.moveTable[props.value.Quick].MoveType + " text"}>
                            {props.value.Quick}
                        </div>}
                    {props.moveTable[props.value.Charge[0]] &&
                        <div className={"mx-1  moveStyle m typeColorC" + props.moveTable[props.value.Charge[0]].MoveType + " text"}>
                            {props.value.Charge[0]}
                        </div>}
                    {props.moveTable[props.value.Charge[1]] &&
                        <div className={"mx-1 moveStyle m typeColorC" + props.moveTable[props.value.Charge[1]].MoveType + " text"}>
                            {props.value.Charge[1]}
                        </div>}
                </div>
            </div>
            <div className="col-auto text-right align-self-center p-0 pr-2">
                {props.value.Rate}
            </div>
        </div>
    )
});

export default RMoveRow;