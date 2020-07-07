import React from "react";

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
        <div className="hpBar">
            <div className="textOnBar">
                {value}/{maxValue}
            </div>
            <div className="hpIndicator" style={{ width: (value / maxValue * 100) + "%" }}></div>
        </div>
    )
});

export default HPIndicator;