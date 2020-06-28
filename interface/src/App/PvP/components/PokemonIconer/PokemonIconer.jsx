import React from "react";

const PokemonIconer = React.memo(function (props) {
    return (
        <img
            src={"/images" + (props.folder ? props.folder : "/pokemons/") + props.src + ".png"}
            className={props.class}
            alt=""
            data-tip data-for={props.for} />
    )
});

export default PokemonIconer