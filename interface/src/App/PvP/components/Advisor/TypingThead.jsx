import React from "react";
import { typeDecoder } from "../../../../js/indexFunctions"
import TheadCell from "./TheadCell"


const TypingThead = React.memo(function Pokemon(props) {
    let arr = []
    for (let j = 0; j < typeDecoder.length; j++) {
        arr.push(<TheadCell key={j + "thead"} type={j} />)
    }

    return (
        <>
            <th key={"zero"} className="modifiedBorderTable theadT p-0 px-1" scope="col" />
            {arr}
        </>
    )
});

export default TypingThead;