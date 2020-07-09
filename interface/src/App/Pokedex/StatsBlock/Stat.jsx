import React from "react";
import ReactTooltip from "react-tooltip"

const Stat = React.memo(function (props) {

    return (
        <div className="col-12 p-0 d-flex my-2" data-tip data-for={props.label}>
            <ReactTooltip
                className={"infoTip"}
                multiline={true}
                id={props.label} effect="solid">
                {props.value}/{props.max}
            </ReactTooltip>
            <div className="col-3 col-sm-2 p-0 dexFont">
                {props.label}
            </div>
            <div className="col-9 col-sm-10 p-0 statBarBack">
                <div className={"statBarFront typeColorC" + props.type + " text"}
                    style={{ width: props.value / props.max * 100 + "%" }}>
                    {props.value}
                </div>
            </div>
        </div>
    )
});

export default Stat;