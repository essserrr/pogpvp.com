import React from "react"

import "./DescrBlock.scss"

const DescrBlock = React.memo(function (props) {
    return (
        <div className="descr-block row m-0 mt-2">
            {props.value}
        </div>
    )

});

export default DescrBlock;