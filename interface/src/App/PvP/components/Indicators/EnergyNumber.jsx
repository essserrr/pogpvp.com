import React from "react";
import ReactTooltip from "react-tooltip"

const EnergyNumber = React.memo(function (props) {
    let value = (props.value !== undefined && props.value !== "") ? (props.value <= 100 ? props.value : 100) : 0
    return (
        <>
            <div
                className="font-weight-bold d-flex justify-content-center align-items-center"
                data-tip data-for={props.for}
            >
                {value}
            </div>
            <ReactTooltip
                className='logItems'
                id={props.for}
                effect='solid'
                place="top"
                multiline={true}
            >
                {props.label}
            </ReactTooltip>
        </>

    )
});

export default EnergyNumber;