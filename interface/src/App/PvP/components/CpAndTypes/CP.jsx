import React from "react";
import { culculateCP } from "../../../../js/indexFunctions.js"

const CP = React.memo(function Pokemon(props) {

    return (
        <div className={props.class}>
            CP: {culculateCP(
            props.name,
            props.Lvl,
            props.Atk,
            props.Def,
            props.Sta,
            props.pokemonTable)}
        </div>
    )

});

export default CP;