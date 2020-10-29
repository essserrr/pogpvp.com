import React from "react";
import { calculateCP, calculateBossCP } from "../../../../js/indexFunctions.js"

const CP = React.memo(function (props) {

    return (
        "CP: " + (props.isBoss ? calculateBossCP(
            props.name,
            props.tier,
            props.pokemonTable,
        ) : calculateCP(props.name,
            props.Lvl,
            props.Atk,
            props.Def,
            props.Sta,
            props.pokemonTable))
    )
});

export default CP;