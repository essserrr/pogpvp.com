import React from "react"
import StatisticsSet from "../../../StatisticsSet/StatisticsSet"

import "./DetailedResult.scss"

const DetailedResult = React.memo(function (props) {
    return (
        <div className="detailed-result row mx-0 p-2">
            <div className="col-12 px-0">
                <StatisticsSet
                    {...props}
                />
            </div>
        </div>
    )
});



export default DetailedResult;