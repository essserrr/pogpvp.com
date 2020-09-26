import React from "react"

import "./FaButton.scss"

const FaButton = React.memo(function (props) {
    return (
        <i
            className={`fabutton ${props.class}`}
            aria-hidden="true"
            name={props.name}
            onClick={props.onClick}
        />
    )
});

export default FaButton;