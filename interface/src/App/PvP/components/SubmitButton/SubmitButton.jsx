import React from "react";

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
            {props.label}
        </button>
    )
});

export default SubmitButton;