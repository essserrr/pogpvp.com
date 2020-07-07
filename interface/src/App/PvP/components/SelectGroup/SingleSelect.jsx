import React from "react";

const SingleSelect = React.memo(function (props) {
    return (
        <select
            className="defaultFont modifiedBorder custom-select"
            id="selectGroup"

            label={props.name}
            name={props.name}
            attr={props.attr}
            value={props.value}
            onChange={props.onChange}
            onClick={props.onClick}
        >
            {props.options}
        </select>
    )
});

export default SingleSelect;