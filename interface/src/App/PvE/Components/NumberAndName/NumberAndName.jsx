import React from "react";
import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"


const NumberAndName = React.memo(function (props) {
    return (
        <>
            <span className="bigText align-self-center ">{"#" + (props.i + 1)}</span>
            <PokemonIconer
                src={props.pok.Number + (props.pok.Forme !== "" ? "-" + props.pok.Forme : "")}
                class={"icon48 mx-1"} />
        </>
    )
});

export default NumberAndName;