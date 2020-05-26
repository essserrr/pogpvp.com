import React from "react";


const Line = React.memo(function (props) {
    return (
        <tr>
            <th className="modifiedBorderTable defaultFont m-0 p-0" scope="row" >{props.title}</th>
            <td className="modifiedBorderTable defaultFont m-0 p-0" >{props.valueA}</td>
            <td className="modifiedBorderTable defaultFont m-0 p-0" >{props.valueD}</td>
        </tr>
    )
});

export default Line;