import React from "react";

const HpBar = React.memo(function (props) {
    return (
        <div className="hpBack">
            <div className="hpFront" style={{ width: props.length + "%" }}></div>
            <div className="hpBound" style={{ left: props.lowbound + "%", width: props.upbound - props.lowbound + "%" }}></div>
        </div>
    )
});

export default HpBar;