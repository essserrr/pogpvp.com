import React from "react"
import TableIcon from "../TableIcon/TableIcon"

const TheadElement = React.memo(function (props) {

    return (
        <th className="tableBorder  text-center theadT p-0 px-1" scope="col" >
            <TableIcon {...props} letter="T" />
        </th>
    )

});

export default TheadElement