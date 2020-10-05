import React from "react"
import AvgResult from "./AvgResult/AvgResult"

const PlayerResEntry = React.memo(function (props) {
    return (
        <div className="row mx-0">
            <div className="col-12 px-0">
                <AvgResult
                    {...props}
                    value={props.value.avg}
                    title={"Avg"}
                />
            </div>
            <div className="col-12 px-0">
                <AvgResult
                    {...props}
                    value={props.value.max}
                    title={"Max"}
                />
            </div>
            <div className="col-12 px-0">
                <AvgResult
                    {...props}
                    value={props.value.min}
                    title={"Min"}
                />
            </div>
        </div>
    )
});



export default PlayerResEntry;