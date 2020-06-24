import React from "react";


const RangeInput = React.memo(function (props) {
    console.log(props.value)
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
            className="custom-range"
        />

    )
});

export default RangeInput;