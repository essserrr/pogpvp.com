import React from "react";


const Checkbox = React.memo(function (props) {
    return (
        <div className={props.class ? props.class : "form-check form-check-inline m-0 p-0"}>
            <input
                onChange={props.onChange}
                checked={props.checked}
                className="form-check-input px-1"
                type="checkbox"
                id={props.name + (props.attr ? props.attr : "")}
                attr={props.attr}
                name={props.name}
                disabled={props.isDisabled}
            />
            <label className="form-check-label pr-2" htmlFor={props.name + (props.attr ? props.attr : "")}>{props.label}</label>
        </div>
    )
});
export default Checkbox;