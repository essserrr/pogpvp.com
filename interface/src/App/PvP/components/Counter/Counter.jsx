import React from "react";

const Counter = React.memo(function (props) {
    return (
        <div className={props.class}>
            {props.value + props.suffix}
        </div>
    )
});

export default Counter;