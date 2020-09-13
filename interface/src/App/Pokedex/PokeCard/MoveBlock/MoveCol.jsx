import React from "react"
import Move from "./Move"


const MoveCol = React.memo(function (props) {
    return (
        <div className={"col-12 col-sm-6 " + props.class}>
            <div className="col-12 p-0 dexFont">
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