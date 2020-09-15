import React from "react"
import ReactTooltip from "react-tooltip"

import "./LabelPrepend.scss"

const LabelPrepend = React.memo(function (props) {
    return (
        <div className="input-group-prepend ">
            <label
                style={{ minWidth: props.labelWidth ? props.labelWidth : "100%" }}
                className={(props.labelStyle) ?
                    "label-prepend input-group-text " + props.labelStyle :
                    "label-prepend label-prepend--colored input-group-text"}
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