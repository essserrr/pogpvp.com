import React from "react";
import Type from "../../PvP/components/CpAndTypes/Type"
import CP from "../../PvP/components/CpAndTypes/CP"
import { typeDecoder } from "../../../js/indexFunctions"

const CardBody = React.memo(function (props) {
    return (
        <>
            <div className="col-12 text-center p-0 align-self-start">
                {(props.state.pokemonTable[props.name]["Type"][0] !== undefined) && <Type
                    class={"icon18"}
                    code={props.state.pokemonTable[props.name]["Type"][0]}
                    value={typeDecoder[props.state.pokemonTable[props.name]["Type"][0]]}
                />}
                {(props.state.pokemonTable[props.name]["Type"][1] !== undefined) && <Type
                    class={"ml-2 icon18"}
                    code={props.state.pokemonTable[props.name]["Type"][1]}
                    value={typeDecoder[props.state.pokemonTable[props.name]["Type"][1]]}
                />}
            </div>
            <div className={"col-12 mt-1 text-center"}>
                <CP
                    name={props.name}
                    Lvl={props.state.Lvl}
                    Atk={props.state.Atk}
                    Def={props.state.Def}
                    Sta={props.state.Sta}
                    pokemonTable={props.state.pokemonTable}
                />
            </div>
        </>
    )
});

export default CardBody