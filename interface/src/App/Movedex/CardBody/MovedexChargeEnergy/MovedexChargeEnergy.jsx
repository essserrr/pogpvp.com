import React from "react";
import ReactTooltip from "react-tooltip"

import "./MovedexChargeEnergy.scss"

const MovedexChargeEnergy = React.memo(function (props) {
    return (
        <div className="row m-0 justify-content-center">
            <div data-tip data-for={props.move.Title + "En"}
                style={{ width: "100px" }}
                className="d-flex justify-content-between">
                <div className={"movedex-chargeen__cell col m-0 typeColorC" + props.move.MoveType} />
                {Math.abs(props.move.Energy) < 100 && <div className={"movedex-chargeen__cell col ml-1 typeColorC" + props.move.MoveType} />}
                {Math.abs(props.move.Energy) < 50 && <div className={"movedex-chargeen__cell col ml-1 typeColorC" + props.move.MoveType} />}
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

export default MovedexChargeEnergy;
