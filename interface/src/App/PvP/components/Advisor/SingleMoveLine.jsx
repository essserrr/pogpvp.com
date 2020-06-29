import React from "react";
import { returnVunStyle, effectivenessData } from "../../..//../js/indexFunctions"


const SingleMoveLine = React.memo(function Pokemon(props) {
    let arr = []

    for (let j = 0; j < effectivenessData[props.MoveType].length; j++) {
        let multipl = effectivenessData[props.MoveType][j] === 0 ? "1.000" :
            (effectivenessData[props.MoveType][j]).toFixed(3);
        let rateStyle = returnVunStyle(multipl === "1.000" ? multipl : (1 / multipl).toFixed(3))

        arr.push(
            <td key={props.line + "offensive" + j} className="modifiedBorderTable matrixColor defaultFont m-0 p-0 align-middle" >
                <div className={"rateTyping hover rateColor " + rateStyle} >
                    {multipl}
                </div>
            </td >)
    }

    return (
        <>
            <td
                className={"modifiedBorderTable text-center align-middle theadT fixFirstRow  m-0 p-0 px-1 typeColor color" + props.MoveType + " text"} >
                {props.name + props.star}
            </td>
            {arr}
        </>
    )
});

export default SingleMoveLine;