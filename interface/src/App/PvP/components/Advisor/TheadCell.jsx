import React from "react";
import { typeDecoder } from "../../../../js/indexFunctions"
import Type from "../CpAndTypes/Type"


const TheadCell = React.memo(function Pokemon(props) {
    return (
        <th className="modifiedBorderTable  text-center theadT p-0 px-1" scope="col" >
            <Type
                class={"icon36 m-1"}
                code={props.type}
                value={typeDecoder[props.type]}
            />
        </th>
    )
});

export default TheadCell;