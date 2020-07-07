import React from "react";
import { culculateCP, culculateBossCP } from "../../../../js/indexFunctions.js"

const CP = React.memo(function (props) {

    return (
        <div className={props.class}>
            CP: {props.isBoss ? culculateBossCP(
            props.name,
            props.tier,
            props.pokemonTable,
        ) : culculateCP(props.name,
            props.Lvl,
            props.Atk,
            props.Def,
            props.Sta,
            props.pokemonTable)}
        </div>
    )
});

export default CP;