import React from "react"
import Iconer from "App/Components/Iconer/Iconer"


const TheadCell = React.memo(function (props) {
    return (
        <th className="text-center p-0 px-1" scope="col" >
            <Iconer
                className={"icon36 m-1"}
                size={36}
                folderName="/type/"
                fileName={props.type}
            />
        </th>
    )
});

export default TheadCell;