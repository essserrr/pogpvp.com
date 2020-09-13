import React from "react"
import ListElement from "./ListElement"


const UsesList = React.memo(function (props) {
    let list = []

    for (const [key, value] of Object.entries(props.pokTable)) {
        switch (props.move.MoveCategory === "Charge Move") {
            case true:
                if (value.ChargeMoves.includes(props.move.Title)) {
                    list.push(
                        <ListElement
                            key={key}
                            name={key}
                            value={value}
                        />)
                }
                break
            default:
                if (value.QuickMoves.includes(props.move.Title)) {
                    list.push(
                        <ListElement
                            key={key}
                            name={key}
                            value={value}
                        />)
                }
        }
    }

    return (
        list.length > 0 && <div className="row m-0">
            {list}
        </div>
    )

});

export default UsesList;
