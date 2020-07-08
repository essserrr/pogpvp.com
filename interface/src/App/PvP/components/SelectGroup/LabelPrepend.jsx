import React from "react";
import ReactTooltip from "react-tooltip"


const LabelPrepend = React.memo(function (props) {
    return (
        <div className="input-group-prepend ">
            <label
                className={(props.labelStyle) ?
                    "modifiedBorder input-group-text labelPrepend typeColor " + props.labelStyle :
                    "modifiedBorder input-group-text labelPrepend "}
                id="selectGroup"

                data-tip data-for={props.for}>
                {props.label}
            </label>
            {(props.for !== "") && <ReactTooltip
                className={props.tipClass}
                id={props.for} effect="solid"
                place={props.place}
                multiline={true}>
                {props.tip}
            </ReactTooltip>}
        </div>
    )
});

export default LabelPrepend;