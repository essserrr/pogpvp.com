import React from "react";

const SingleButton = React.memo(function (props) {
    return (
        <label className={(props.class ? props.class : "") + " btn btn-primary m-0 " + (props.checked ? "active" : "")}>
            <input
                type="radio"
                name={props.name}
                id={props.id}
                onChange={props.onChange}
                checked={props.checked}
                autoComplete="off" />{props.label}
        </label>
    )
});


export default SingleButton;