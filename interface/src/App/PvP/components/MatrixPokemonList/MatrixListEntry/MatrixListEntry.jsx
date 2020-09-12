import React from "react"
import CloseButton from "../../MagicBox/CloseButton"

import "./MatrixListEntry.scss"

const MatrixListEntry = React.memo(function (props) {
    return (
        <div onClick={props.onClick} attr={props.attr} index={props.index} className={"matrix-list-entry clickable px-1 "}>
            <CloseButton
                onClick={props.onPokemonDelete}
                attr={props.attr}
                index={props.index}

                className="close mx-0"
            />
            <div className="matrix-list-entry__thead ">
                {props.thead}
            </div>
            <div className="matrix-list-entry__body ">
                {props.body}
            </div>
        </div>
    )
});

export default MatrixListEntry;