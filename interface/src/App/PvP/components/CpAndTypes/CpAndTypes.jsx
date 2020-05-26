import React from "react";
import CP from "./CP"
import Type from "./Type"
import { typeDecoder } from "../../../../js/indexFunctions.js"

const CpAndTyping = React.memo(function Pokemon(props) {
    return (
        <div className="defaultFont mt-2">
            <CP
                class="d-inline mr-2"
                name={props.name}
                Lvl={props.Lvl}
                Atk={props.Atk}
                Def={props.Def}
                Sta={props.Sta}
                pokemonTable={props.pokemonTable}
            />

            {(props.pokemonTable[props.name]["Type"][0] !== undefined) && <Type
                class={"d-inline border-0 rounded mx-1 p-1 type color" + props.pokemonTable[props.name]["Type"][0] + " text"}
                value={typeDecoder[props.pokemonTable[props.name]["Type"][0]]}
            />}

            {(props.pokemonTable[props.name]["Type"][1] !== undefined) && <Type
                class={"d-inline border-0 rounded mx-1 p-1 type color" + props.pokemonTable[props.name]["Type"][1] + " text"}
                value={typeDecoder[props.pokemonTable[props.name]["Type"][1]]}
            />}



        </div>

    )

});

export default CpAndTyping;