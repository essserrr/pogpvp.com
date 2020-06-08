import React from "react";
import CloseButton from "../MagicBox/CloseButton"


const ListEntry = React.memo(function (props) {
    return (
        <div onClick={props.onClick} attr={props.attr} index={props.index} className={"matrixListEntry hoverable clickable px-1 " + props.className}>
            <CloseButton
                onClick={props.onPokemonDelete}
                attr={props.attr}
                index={props.index}

                className="close mx-0"
            />
            <div className="thead ">
                {props.thead}
            </div>
            <div className="body">
                {props.body}
            </div>
        </div>
    )
});

export default ListEntry;