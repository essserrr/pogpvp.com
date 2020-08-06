import React from "react";
import CP from "./CP"
import Type from "./Type"

const CpAndTyping = React.memo(function (props) {
    return (
        <div className="d-flex dont90 justify-content-center mt-2">
            <CP
                class="mr-2 fBolder align-self-center"
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
            />}

            {(props.pokemonTable[props.name].Type[1] !== undefined) && <Type
                class={"ml-2 icon18"}
                code={props.pokemonTable[props.name].Type[1]}
            />}
        </div>

    )

});

export default CpAndTyping;