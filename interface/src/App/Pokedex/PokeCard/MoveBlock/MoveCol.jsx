import React from "react"
import Move from "./Move"

import "./MoveCol.scss"

const MoveCol = React.memo(function (props) {
    return (
        <div className={"col-12 col-sm-6 " + props.class}>
            <div className="move-col--text col-12 p-0">
                {props.title}
            </div>
            {props.value.map((elem) => <Move
                key={elem}
                value={props.moveTable[elem]}
                pok={props.pok}
            />)}
        </div>
    )

});

export default MoveCol;