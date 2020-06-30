import React from "react";
import ReactTooltip from "react-tooltip"

const ChargeEnergy = React.memo(function (props) {

    let energy = []

    for (let i = 0; i < Math.trunc(100 / Math.abs(props.move.Energy)); i++) {
        energy.push(
            <div className={"energyBlock " + (i > 0 ? "mr-1" : "")} />
        )
    }

    return (
        <div className="row m-0 p-0 justify-content-center">
            <div data-tip data-for={"chargeEn"}
                className="energyCell d-flex m-0 p-0 justify-content-between">
                <div className={"col energyBlock m-0 color" + props.move.MoveType} />
                {Math.abs(props.move.Energy) < 100 && <div className={"col energyBlock ml-1 color" + props.move.MoveType} />}
                {Math.abs(props.move.Energy) < 50 && <div className={"col energyBlock ml-1 color" + props.move.MoveType} />}
            </div>
            <ReactTooltip
                className={"infoTip"}
                id={"chargeEn"} effect='solid'
                place={"top"}
                multiline={false}>
                {props.move.Energy}
            </ReactTooltip>
        </div>
    )

});

export default ChargeEnergy;
