import React from "react"
import Type from "../../../../../../../CpAndTypes/Type"


const TheadCell = React.memo(function (props) {
    return (
        <th className="text-center p-0 px-1" scope="col" >
            <Type
                class={"icon36 m-1"}
                code={props.type}
            />
        </th>
    )
});

export default TheadCell;