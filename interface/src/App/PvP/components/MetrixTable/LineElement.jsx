import React from "react";
import TableIcon from "./TableIcon"

const LineElement = React.memo(function (props) {
    return (
        <td className="modifiedBorderTable text-center theadT fixFirstRow m-0 p-0 px-1" >
            <TableIcon {...props} letter="R" />
        </td>
    )

});

export default LineElement