import React from "react";
import LabelPrepend from "./LabelPrepend"
import SingleSelect from "./SingleSelect"

const SelectGroup = React.memo(function (props) {
    return (
        <div className={props.class ? props.class : "input-group input-group-sm mt-2"}>
            {props.label && <LabelPrepend
                label={props.label}
                labelStyle={props.labelStyle}

                tipClass={props.tipClass}
                for={props.for}
                tip={props.tip}
                place={props.place}
            />}
            <SingleSelect
                name={props.name}
                attr={props.attr}
                value={props.value}
                onChange={props.onChange}
                onClick={props.onClick}
                options={props.options}
            />
        </div>
    )
});

export default SelectGroup;