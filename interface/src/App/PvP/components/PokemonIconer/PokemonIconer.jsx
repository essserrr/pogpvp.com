import React from "react";

const PokemonIconer = React.memo(function (props) {
    try {
        // a path we KNOW is totally bogus and not a module
        var value = require("../../../../icons/pokemons/" + props.src + props.withSuffix + ".svg")
    }
    catch (e) {
        try {
            // a path we KNOW is totally bogus and not a module
            value = require("../../../../icons/pokemons/" + props.src + ".svg")
        }
        catch (e) {
            console.log(props.src + " icon with suffix " + props.withSuffix + " not found")
        }
    }
    return (
        value && <img
            src={value}
            className={props.class}
            alt="" />
    )
});

export default PokemonIconer