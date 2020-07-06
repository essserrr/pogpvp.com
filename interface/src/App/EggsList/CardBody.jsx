import React from 'react';
import Type from "../PvP/components/CpAndTypes/Type"
import Range from "../RaidsList/Range/Range"

import { typeDecoder, culculateCP } from "../../js/indexFunctions"

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
                innerClass="col-12 text-center p-0 m-0 align-self-end"
                left={culculateCP(props.name, 15, 10, 10, 10, props.pokTable)}
                right={culculateCP(props.name, 15, 15, 15, 15, props.pokTable)}
            />
        </>
    )
});

export default CardBody