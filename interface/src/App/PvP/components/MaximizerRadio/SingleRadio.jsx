import React from "react";

const SingleRadio = React.memo(function (props) {
    return (
        <div className="custom-control custom-radio">

            <input
                type="radio"
                id={props.value + props.attr}
                className="custom-control-input "

                action={props.action}
                attr={props.attr}
                name={props.name}
                value={props.value}
                checked={props.checked}
                onChange={props.onChange}
            />
            <label
                className="custom-control-label d-flex align-items-center fBolder"
                htmlFor={props.value + props.attr}
            >
                {props.label}
            </label>
        </div>

    )
});

export default SingleRadio;