import React from "react";

const Thead = React.memo(function (props) {
    return (
        <thead className="thead" >
            <tr>
                <th className="font-weight-bold" scope="col" ></th>
                <th className="font-weight-bold" scope="col" >{props.NameA}</th>
                <th className="font-weight-bold" scope="col" >{props.NameD}</th>
            </tr>
        </thead>
    )
});

export default Thead;