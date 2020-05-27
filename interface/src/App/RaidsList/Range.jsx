import React from "react";


const Range = React.memo(function Pokemon(props) {
    return (
        <div className={"d-flex justify-content-start p-0 m-0 " + (props.innerClass ? props.innerClass : "")}>
            <div className={"p-0 m-0 text-center"}>
                {props.title}{props.left}-{props.right}
            </div>
        </div>
    )
});
export default Range;