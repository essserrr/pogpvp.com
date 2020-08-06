import React from "react";
import Type from "../PvP/components/CpAndTypes/Type"

import { culculateCP } from "../../js/indexFunctions"

const CardBody = React.memo(function (props) {
    return (
        <>
            <div className="col p-0 pb-0 pb-sm-1">
                {(props.pokTable[props.name].Type[0] !== undefined) && <Type
                    class={"icon18"}
                    code={props.pokTable[props.name].Type[0]}
                />}
                {(props.pokTable[props.name].Type[1] !== undefined) && <Type
                    class={"ml-2 icon18"}
                    code={props.pokTable[props.name].Type[1]}
                />}
            </div>
            {"CP: " + culculateCP(props.name, 15, 10, 10, 10, props.pokTable) + "-" + culculateCP(props.name, 15, 15, 15, 15, props.pokTable)}
        </>
    )
});

export default CardBody