import React from "react";

const Stat = React.memo(function (props) {

    return (
        <div className="col-12 p-0 d-flex my-2">
            <div className="col-3 col-sm-2 p-0 dexFont">
                {props.label}
            </div>
            <div className="col-9 col-sm-10 p-0 dexStatBack">
                <div className={"dexStatFront typeColor color" + props.type + " text"}
                    style={{ width: props.value / props.max * 100 + "%" }}>
                    {props.value}
                </div>
            </div>
        </div>
    )
});

export default Stat;