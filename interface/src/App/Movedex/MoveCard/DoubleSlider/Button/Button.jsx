import React from "react"

const Button = React.memo(function (props) {
    return (
        <button
            disabled={props.disabled}

            attr={props.attr}
            onClick={props.onClick}
            className={props.class}>
            {props.title}
        </button>
    )
});

export default Button;