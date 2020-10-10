import React from "react"

import "./SubmitButton.scss"

const SubmitButton = React.memo(function (props) {
    return (
        <button
            type="submit"
            className={props.class}
            stat={props.stat}
            level={props.level}
            attr={props.attr}
            action={props.action}
            disabled={props.disabled}
            onClick={props.onSubmit}
        >
            {props.children}
        </button>
    )
});

export default SubmitButton;