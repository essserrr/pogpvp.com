import React from "react";
import ReactTooltip from "react-tooltip"

const ChargeEnergy = React.memo(function (props) {
    return (
        <div className="row m-0 justify-content-center">
            <div data-tip data-for={props.move.Title + "En"}
                className="energyCell d-flex justify-content-between">
                <div className={"col energyBlock m-0 typeColor color" + props.move.MoveType} />
                {Math.abs(props.move.Energy) < 100 && <div className={"col energyBlock ml-1 typeColor color" + props.move.MoveType} />}
                {Math.abs(props.move.Energy) < 50 && <div className={"col energyBlock ml-1 typeColor color" + props.move.MoveType} />}
            </div>
            <ReactTooltip
                className={"infoTip"}
                id={props.move.Title + "En"} effect="solid"
                place={"top"}
                multiline={false}>
                {props.move.Energy}
            </ReactTooltip>
        </div>
    )

});

export default ChargeEnergy;
