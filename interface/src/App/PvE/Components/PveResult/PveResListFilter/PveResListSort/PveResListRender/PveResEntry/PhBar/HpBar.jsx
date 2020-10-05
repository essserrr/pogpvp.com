import React from "react"

import "./HpBar.scss"

const HpBar = React.memo(function (props) {
    return (
        <div className="hpbar__background">
            <div className="hpbar__front" style={{ width: props.avg + "%" }}></div>
            <div className="hpbar__bound" style={{ left: props.low + "%", width: props.up - props.low + "%" }}></div>
        </div>
    )
});

export default HpBar;