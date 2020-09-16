import React from "react"
import PokemonIconer from "../../../../../../../../PvP/components/PokemonIconer/PokemonIconer"
import { ReactComponent as Shadow } from "../../../../../../../../../icons/shadow.svg"

import "./NumberAndIcon.scss"

const NumberAndIcon = React.memo(function (props) {
    return (
        <div className="number-and-icon col-auto p-0">
            {props.index && <span className="align-self-center ">{props.index}</span>}
            {props.isShadow && <Shadow className="number-and-icon__shadow" />}
            <PokemonIconer
                src={props.pok.Number + (props.pok.Forme !== "" ? "-" + props.pok.Forme : "")}
                class={"number-and-icon__pok mx-1"} />
        </div>
    )
});

export default NumberAndIcon;