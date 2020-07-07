import React from "react";
import CP from "./CP"
import Type from "./Type"
import { typeDecoder } from "../../../../js/indexFunctions.js"

const CpAndTyping = React.memo(function (props) {
    return (
        <div className="defaultFont mt-2">
            <CP
                class="d-inline mr-2 fBolder"
                name={props.name}
                tier={props.tier}
                isBoss={props.isBoss}

                Lvl={props.Lvl}
                Atk={props.Atk}
                Def={props.Def}
                Sta={props.Sta}
                pokemonTable={props.pokemonTable}
            />
            {(props.pokemonTable[props.name].Type[0] !== undefined) && <Type
                class={"icon18"}
                code={props.pokemonTable[props.name].Type[0]}
                value={typeDecoder[props.pokemonTable[props.name].Type[0]]}
            />}

            {(props.pokemonTable[props.name].Type[1] !== undefined) && <Type
                class={"ml-2 icon18"}
                code={props.pokemonTable[props.name].Type[1]}
                value={typeDecoder[props.pokemonTable[props.name].Type[1]]}
            />}
        </div>

    )

});

export default CpAndTyping;