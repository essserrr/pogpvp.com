import React from "react"

import "./HpBar.scss"

const HpBar = React.memo(function (props) {
    return (
        <div className="hpbar__background">
            <div className="hpbar__front" style={{ width: props.length + "%" }}></div>
            <div className="hpbar__bound" style={{ left: props.lowbound + "%", width: props.upbound - props.lowbound + "%" }}></div>
        </div>
    )
});

export default HpBar;