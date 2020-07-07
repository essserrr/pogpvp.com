import React from "react";
import TableIcon from "./TableIcon"

const TheadElement = React.memo(function (props) {

    return (
        <th className="modifiedBorderTable  text-center theadT p-0 px-1" scope="col" >
            <TableIcon {...props} letter="T" />
        </th>
    )

});

export default TheadElement