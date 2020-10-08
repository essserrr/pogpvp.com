import React from "react"
import DetailedWrapper from "./DetailedWrapper/DetailedWrapper"

const DetailedStatisticsGenerator = React.memo(function (props) {
    return (
        Object.entries(props.value).map(detailed =>
            <DetailedWrapper
                key={detailed[0]}
                {...props}
                value={detailed[1]}
            />
        )
    )
});



export default DetailedStatisticsGenerator;