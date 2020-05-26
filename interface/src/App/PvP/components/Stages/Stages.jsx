import React from "react";
import LabelPrepend from "../SelectGroup/LabelPrepend"
import SingleSelect from "../SelectGroup/SingleSelect"

const Stages = React.memo(function (props) {
    return (
        <div className="input-group input-group-sm mt-2">
            <LabelPrepend
                label={props.label}

                for={props.for}
                tip={props.tip}
                place={props.place}
            />
            <SingleSelect
                name="AtkStage"
                attr={props.attr}
                value={props.Atk}

                onChange={props.onChange}
                options={props.options}
            />
            <SingleSelect
                name="DefStage"
                attr={props.attr}
                value={props.Def}
                onChange={props.onChange}
                options={props.options}
            />
        </div>
    )
});






export default Stages;