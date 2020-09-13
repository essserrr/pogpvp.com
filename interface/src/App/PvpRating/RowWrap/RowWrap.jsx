import React from "react"

import "./RowWrap.scss"

const RowWrap = React.memo(function (props) {
    return (
        <div className={props.outClass}>
            <div className="row-wrap row justify-content-between mb-1 mx-2 mx-md-3">
                {props.locale}
                {!props.disableIcon && <i className="align-self-end fas fa-trophy mr-2 mb-1"></i>}
            </div>
            {props.value}
        </div>
    )
});

export default RowWrap;