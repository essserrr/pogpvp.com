import React from "react";
import ReactTooltip from "react-tooltip"

const ChargeEnergy = React.memo(function (props) {

    return (
        <div className="row m-0 p-0 justify-content-center">
            <div data-tip data-for={props.move.Title + "En"}
                className="col-12 d-flex m-0 p-0 justify-content-between">
                <div className={"col dexEnergyBlock m-0 " + (props.move.MoveType === 1 ? "Dark" : "")} />
                {Math.abs(props.move.Energy) < 100 && <div className={"col dexEnergyBlock ml-1 " + (props.move.MoveType === 1 ? "Dark" : "")} />}
                {Math.abs(props.move.Energy) < 50 && <div className={"col dexEnergyBlock ml-1 " + (props.move.MoveType === 1 ? "Dark" : "")} />}
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
