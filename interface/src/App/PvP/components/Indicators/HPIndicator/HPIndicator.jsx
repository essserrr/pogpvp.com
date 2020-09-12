import React from "react"

import "./HPIndicator.scss"

const HPIndicator = React.memo(function (props) {
    let maxValue
    let defaultValue

    switch (props.maxValue === undefined) {
        case true:
            maxValue = props.effSta
            defaultValue = maxValue
            break
        default:
            maxValue = props.maxValue
            defaultValue = props.defaultValue
    }

    let value = (props.value !== undefined && props.value !== "") ? (props.value <= maxValue ? props.value : defaultValue) : defaultValue;

    return (
        <div className="hp-indicator">
            <div className="hp-indicator__text">
                {value}/{maxValue}
            </div>
            <div className="hp-indicator__bar" style={{ width: (value / maxValue * 100) + "%" }}></div>
        </div>
    )
});

export default HPIndicator;