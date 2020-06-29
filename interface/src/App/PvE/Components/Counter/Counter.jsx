import React from "react";


const Counter = React.memo(function (props) {

    return (
        <>
            {props.name}: <span className={"fontBolder " + (props.colorForvalue && props.value > 0 ? "boostColor" : "")}>
                {props.value}</span>

            {((props.value - props.base) > 0) &&
                <span className="fontBolder boostColor">
                    (+{props.toFixed ? (props.value - props.base).toFixed(props.decimal) : props.value - props.base})
                </span>}
        </>
    )

});

export default Counter;