import React from "react";


const Line = React.memo(function (props) {
    return (
        <tr>
            <th style={{ maxWidth: "140px" }} className="tableBorder fBolder m-0 p-0" scope="row" >{props.title}</th>
            <td className="tableBorder fBolder m-0 p-0" >{props.valueA}</td>
            <td className="tableBorder fBolder m-0 p-0" >{props.valueD}</td>
        </tr>
    )
});

export default Line;