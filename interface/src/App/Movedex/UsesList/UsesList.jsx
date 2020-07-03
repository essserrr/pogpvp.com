import React from "react";
import ListElement from "./ListElement"


const UsesList = React.memo(function (props) {
    let list = []

    for (const [key, value] of Object.entries(props.pokTable)) {
        switch (props.move.MoveCategory === "Charge Move") {
            case true:
                if (findIn(value.ChargeMoves, props.move.Title)) {
                    list.push(
                        <ListElement
                            key={key}
                            name={key}
                            value={value}
                        />)
                }
                break
            default:
                if (findIn(value.QuickMoves, props.move.Title)) {
                    list.push(
                        <ListElement
                            key={key}
                            name={key}
                            value={value}
                        />)
                }
        }

    }

    function findIn(arr, string) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === string) {
                return true
            }
        }
        return false
    }

    return (
        list.length > 0 && <div className="row m-0">
            {list}
        </div>
    )

});

export default UsesList;
