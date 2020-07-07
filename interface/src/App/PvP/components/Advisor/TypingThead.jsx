import React from "react";
import { typeDecoder } from "../../../../js/indexFunctions"
import TheadCell from "./TheadCell"


const TypingThead = React.memo(function (props) {

    return (
        <>
            <th key={"zero"} className="modifiedBorderTable theadT p-0 px-1" scope="col" />
            {typeDecoder.map((elem, i) => <TheadCell key={i + "thead"} type={i} />)}
        </>
    )
});

export default TypingThead;