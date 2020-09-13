import React from "react"
import ReactTooltip from "react-tooltip"

import "./PokedexChargeEnergy.scss"

const PokedexChargeEnergy = React.memo(function (props) {

    return (
        <div className="row m-0 justify-content-center">
            <div data-tip data-for={props.move.Title + "En"}
                className="col-12 d-flex p-0 justify-content-between">
                <div className={"pokedex-chergeen__cell col " + (props.move.MoveType === 1 ? "Dark" : "")} />
                {Math.abs(props.move.Energy) < 100 && <div className={"pokedex-chergeen__cell col ml-1 " + (props.move.MoveType === 1 ? "Dark" : "")} />}
                {Math.abs(props.move.Energy) < 50 && <div className={"pokedex-chergeen__cell col ml-1 " + (props.move.MoveType === 1 ? "Dark" : "")} />}
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

export default PokedexChargeEnergy;
