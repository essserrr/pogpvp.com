import React from "react";
import PokemonIconer from "../PokemonIconer/PokemonIconer"

const Type = React.memo(function Pokemon(props) {

    return (
        props.value && <abbr title={props.value} className="initialism">
            <PokemonIconer
                folder="/type/"
                src={props.code}
                class={props.class}
            />
        </abbr>
    )

});

export default Type;