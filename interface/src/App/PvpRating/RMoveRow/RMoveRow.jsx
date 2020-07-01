import React from "react";

const RMoveRow = React.memo(function (props) {
    return (
        <div className="col-12  collapseList animRating m-0 mb-1 p-0">
            <div className="row justify-content-between  m-0 p-0">
                <div className="col-10 m-0 p-0">
                    <div className="row justify-content-md-left m-0 p-0">
                        {props.moveTable[props.value.Quick] &&
                            <div className={"mx-1 moveStyle typeColor color" + props.moveTable[props.value.Quick].MoveType + " text"}>
                                {props.value.Quick}
                            </div>}
                        {props.moveTable[props.value.Charge[0]] &&
                            <div className={"mx-1  moveStyle typeColor color" + props.moveTable[props.value.Charge[0]].MoveType + " text"}>
                                {props.value.Charge[0]}
                            </div>}
                        {props.moveTable[props.value.Charge[1]] &&
                            <div className={"mx-1 moveStyle typeColor color" + props.moveTable[props.value.Charge[1]].MoveType + " text"}>
                                {props.value.Charge[1]}
                            </div>}
                    </div>
                </div>
                <div className="col-2 text-right align-self-center m-0 p-0 pr-2">
                    {props.value.Rate}
                </div>
            </div>
        </div>
    )
});

export default RMoveRow;