import React from "react"

import "./PveResTitle.scss"

const PveResTitle = React.memo(function (props) {
    return (
        <div className="row mx-0">
            <div className="pveres-title col-12 px-0">
                {props.children}
            </div>
        </div>
    )
});



export default PveResTitle;