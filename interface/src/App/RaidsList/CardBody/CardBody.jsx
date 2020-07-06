import React from "react";
import Type from "../../PvP/components/CpAndTypes/Type"
import Range from "../Range/Range"
import { typeDecoder, culculateCP, weatherDecoder } from "../../../js/indexFunctions"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"

const CardBody = React.memo(function (props) {
    return (
        <>
            <div className="col-12 text-center  m-0 p-0 align-self-start">
                {(props.pokTable[props.name]["Type"][0] !== undefined) && <Type
                    class={"icon18"}
                    code={props.pokTable[props.name]["Type"][0]}
                    value={typeDecoder[props.pokTable[props.name]["Type"][0]]}
                />}
                {(props.pokTable[props.name]["Type"][1] !== undefined) && <Type
                    class={"ml-2 icon18"}
                    code={props.pokTable[props.name]["Type"][1]}
                    value={typeDecoder[props.pokTable[props.name]["Type"][1]]}
                />}
            </div>

            <Range
                title="CP: "
                left={culculateCP(props.name, 20, 10, 10, 10, props.pokTable)}
                right={culculateCP(props.name, 20, 15, 15, 15, props.pokTable)}
            />
            <Range
                title={<>
                    {(props.pokTable[props.name]["Type"][0] !== undefined) && <PokemonIconer
                        folder="/weather/"
                        src={weatherDecoder[props.pokTable[props.name]["Type"][0]]}
                        class={"icon18"} />}
                    {(props.pokTable[props.name]["Type"][1] !== undefined) && weatherDecoder[props.pokTable[props.name]["Type"][1]] !== weatherDecoder[props.pokTable[props.name]["Type"][0]] && <PokemonIconer
                        folder="/weather/"
                        src={weatherDecoder[props.pokTable[props.name]["Type"][1]]}
                        class={"icon18"} />}
                    {": "}
                </>}
                left={culculateCP(props.name, 25, 10, 10, 10, props.pokTable)}
                right={culculateCP(props.name, 25, 15, 15, 15, props.pokTable)}
            />
        </>
    )
});
export default CardBody;