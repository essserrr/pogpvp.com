import React from "react";
import Options from "../Options/Options";

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
            <Options

                options={props.options}
            />

        </select>
    )
});

export default SingleSelect;