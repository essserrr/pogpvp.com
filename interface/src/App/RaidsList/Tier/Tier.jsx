import React from "react";


const Tier = React.memo(function (props) {
    return (
        <>
            {props.title && <div className={props.class} >{props.title}</div>}
            <div className={"row justify-content-center m-0 mb-2"}>
                {props.list}
            </div>
        </>
    )
});
export default Tier;