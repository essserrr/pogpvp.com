import React from "react"
import Type from "../../../../PvP/components/CpAndTypes/Type"
import { calculateCP, weatherDecoder } from "../../../../../js/indexFunctions"
import PokemonIconer from "../../../../PvP/components/PokemonIconer/PokemonIconer"

const CardBody = React.memo(function (props) {
    return (
        <>
            <div className="col-12 p-0">
                {(props.pokTable[props.name].Type[0] !== undefined) && <Type
                    class={"icon18"}
                    code={props.pokTable[props.name].Type[0]}
                />}
                {(props.pokTable[props.name].Type[1] !== undefined) && <Type
                    class={"ml-2 icon18"}
                    code={props.pokTable[props.name].Type[1]}
                />}
            </div>
            {"CP: " + calculateCP(props.name, 20, 10, 10, 10, props.pokTable) + "-" + calculateCP(props.name, 20, 15, 15, 15, props.pokTable)}
            <div className="col-12 p-0">
                {(props.pokTable[props.name].Type[0] !== undefined) && <PokemonIconer
                    folder="/weather/"
                    src={weatherDecoder[props.pokTable[props.name].Type[0]]}
                    class={"icon18"} />}
                {(props.pokTable[props.name].Type[1] !== undefined) && weatherDecoder[props.pokTable[props.name].Type[1]] !== weatherDecoder[props.pokTable[props.name].Type[0]] && <PokemonIconer
                    folder="/weather/"
                    src={weatherDecoder[props.pokTable[props.name].Type[1]]}
                    class={"icon18"} />}
                {": " + calculateCP(props.name, 25, 10, 10, 10, props.pokTable) + "-" + calculateCP(props.name, 25, 15, 15, 15, props.pokTable)}
            </div>
        </>
    )
});
export default CardBody;