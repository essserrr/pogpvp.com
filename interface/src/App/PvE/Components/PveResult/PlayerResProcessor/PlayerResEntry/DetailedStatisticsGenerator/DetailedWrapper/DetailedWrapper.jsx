import React from "react"
import DetailedResult from "./DetailedResult/DetailedResult"

const DetailedWrapper = React.memo(function (props) {
    return (
        <div className="row mx-0">
            <div className="col-12 my-1 px-0">
                <DetailedResult
                    {...props}
                />
            </div>
        </div>

    )
});



export default DetailedWrapper;