import React from "react";

const DescrBlock = React.memo(function (props) {
    return (
        <div className="row m-0 p-0 mt-2 tipfont">
            {props.value}
        </div>
    )

});

export default DescrBlock;