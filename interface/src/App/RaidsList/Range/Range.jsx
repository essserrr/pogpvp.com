import React from "react";


const Range = React.memo(function (props) {
    return (
        <div className={(props.innerClass ? props.innerClass : "col-12 text-center p-0 m-0")}>
            {props.title}{props.left}-{props.right}
        </div>
    )
});
export default Range;