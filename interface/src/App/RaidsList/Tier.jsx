import React from "react";


const Tier = React.memo(function Pokemon(props) {
    return (
        <>
            {<div className="separator capsSeparator" >{props.title}</div>}
            <div className={"row justify-content-center p-0 m-0 mb-2"}>
                {props.list}
            </div>
        </>
    )
});
export default Tier;