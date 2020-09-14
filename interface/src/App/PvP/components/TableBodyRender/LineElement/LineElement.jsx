import React from "react"
import TableIcon from "../TableIcon/TableIcon"

import "./LineElement.scss"

const LineElement = React.memo(function (props) {
    return (
        <td className="line-element text-center m-0 p-0 px-1" >
            <TableIcon {...props} letter="R" />
        </td>
    )

});

export default LineElement