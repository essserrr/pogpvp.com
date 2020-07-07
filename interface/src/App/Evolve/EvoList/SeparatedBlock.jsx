import React from "react";

const SeparatedBlock = React.memo(function (props) {
    return (
        <>
            <div className={props.separator ? "row justify-content-center p-0 m-0 mb-2" : "row justify-content-center p-0 m-0"}>
                {props.elem}
            </div>
            {props.separator}
        </>
    )
});

export default SeparatedBlock;
