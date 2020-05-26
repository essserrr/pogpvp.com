import React from "react";

const Thead = React.memo(function (props) {
    return (
        <thead className="thead" >
            <tr >
                <th className="modifiedBorderTable theadT" scope="col" ></th>
                <th className="modifiedBorderTable theadT" scope="col" >{props.NameA}</th>
                <th className="modifiedBorderTable theadT" scope="col" >{props.NameD}</th>
            </tr>
        </thead>
    )
});

export default Thead;