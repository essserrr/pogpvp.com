import React from "react"
import PokemonIconer from "../../../../../../../../PvP/components/PokemonIconer/PokemonIconer"
import { ReactComponent as Shadow } from "../../../../../../../../../icons/shadow.svg"

const NumberAndIcon = React.memo(function (props) {
    return (
        <div className="col-auto p-0 posRel">
            {props.index && <span className="bigFont align-self-center ">{props.index}</span>}
            {props.isShadow && <Shadow className="posAbs icon18" />}
            <PokemonIconer
                src={props.pok.Number + (props.pok.Forme !== "" ? "-" + props.pok.Forme : "")}
                class={"icon48 mx-1"} />
        </div>
    )
});

export default NumberAndIcon;