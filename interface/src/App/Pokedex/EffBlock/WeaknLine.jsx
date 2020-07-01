import React from "react";
import { returnVunStyle, effectivenessData } from "../../../js/indexFunctions"


const WeaknLine = React.memo(function (props) {

    let arr = []
    for (let i = 0; i < effectivenessData.length; i++) {
        let eff = 1
        let rateStyle = "res0"

        switch (props.reverse) {
            case true:
                for (let j = 0; j < props.type.length; j++) {
                    eff *= (effectivenessData[props.type[j]][i] === 0 ? 1 : effectivenessData[props.type[j]][i])
                }
                rateStyle = returnVunStyle((1 / eff).toFixed(3))
                break
            default:
                for (let j = 0; j < props.type.length; j++) {
                    eff *= (effectivenessData[i][props.type[j]] === 0 ? 1 : effectivenessData[i][props.type[j]])
                }
                rateStyle = returnVunStyle(eff.toFixed(3))
        }


        arr.push(
            <td key={i + "defensive"} className="modifiedBorderTable defaultFont align-middle" >
                <div className={"rateTyping hover rateColor " + rateStyle}>
                    {eff.toFixed(3)}
                </div>
            </td >)
    }

    console.log(arr)
    return (
        <tr>
            <td className="modifiedBorderTable align-middle text-center fixFirstRow dexFont m-0 p-0 px-1"
                style={{ backgroundColor: props.reverse ? "" : "white" }} >
                {props.title}
            </td>
            {arr}
        </tr>
    )
});

export default WeaknLine;