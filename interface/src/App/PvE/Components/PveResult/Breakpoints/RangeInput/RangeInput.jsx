import React from "react";


const RangeInput = React.memo(function (props) {
    return (
        <input
            name={props.name}
            attr={props.attr}
            onChange={props.onChange}

            min={props.min}
            max={props.max}

            step={props.step}
            value={props.value}

            type="range"
            className={props.class ? props.class : "custom-range"}
        />

    )
});

export default RangeInput;