import React from "react";

const Thead = React.memo(function (props) {
    return (
        <thead className="thead" >
            <tr >
                <th className="tableBorder font-weight-bold dexFont" scope="col" ></th>
                <th className="tableBorder font-weight-bold dexFont" scope="col" >{props.NameA}</th>
                <th className="tableBorder font-weight-bold dexFont" scope="col" >{props.NameD}</th>
            </tr>
        </thead>
    )
});

export default Thead;