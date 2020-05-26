import React from "react";

const HPIndicator = React.memo(function (props) {
    var maxValue
    var defaultValue
    if (props.maxValue === undefined) {
        maxValue = props.effSta
        defaultValue = maxValue
    } else {
        maxValue = props.maxValue
        defaultValue = props.defaultValue
    }
    var value = (props.value !== undefined && props.value !== "") ?
        ((props.value <= maxValue) ? props.value : defaultValue)
        : defaultValue;

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