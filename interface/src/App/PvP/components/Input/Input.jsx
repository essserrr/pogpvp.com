import React from "react"

import "./Input.scss"

const Input = React.memo(function (props) {
    return (
        <input
            className={`single-input form-control ${props.class ? props.class : ""}`}

            name={props.name}
            type="text"
            attr={props.attr}
            value={props.value}


            data-tip data-for={props.for}
            placeholder={props.place}

            readOnly={props.readonly}

            onChange={props.onChange}
            onClick={props.onClick}
        />
    )
});

export default Input