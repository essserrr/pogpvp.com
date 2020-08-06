import React from "react";
import PokemonIconer from "../PokemonIconer/PokemonIconer"

const Type = React.memo(function (props) {

    return (
        <PokemonIconer
            folder="/type/"
            src={props.code}
            class={props.class}
        />
    )

});

export default Type;