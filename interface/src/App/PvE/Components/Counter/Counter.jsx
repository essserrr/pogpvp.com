import React from "react"

import "./Counter.scss"

const Counter = React.memo(function (props) {

    return (
        <>
            {props.name}: <span className={"font-weight-bold " + (props.colorForvalue && props.value > 0 ? "counter--isboosted" : "")}>
                {props.value}</span>

            {((props.value - props.base) > 0) &&
                <span className="font-weight-bold counter--isboosted">
                    {"(+" + (props.toFixed ? (props.value - props.base).toFixed(props.decimal) : props.value - props.base) + ")"}
                </span>}
        </>
    )

});

export default Counter;