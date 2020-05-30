import React from "react";

const PokemonIconer = React.memo(function (props) {
    try {
        var value = require("../../../../icons" + (props.folder ? props.folder : "/pokemons/") + props.src + ".png")
    }
    catch (e) {
        console.log("Icon " + props.src + " not found")
    }
    return (
        value && <img
            src={value}
            className={props.class}
            alt=""
            data-tip data-for={props.for} />
    )
});

export default PokemonIconer