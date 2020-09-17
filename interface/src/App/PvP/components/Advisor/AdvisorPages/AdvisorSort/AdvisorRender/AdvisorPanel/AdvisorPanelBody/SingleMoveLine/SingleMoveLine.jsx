import React from "react"
import { returnVunStyle, effectivenessData } from "../../../../../../../../../../js/indexFunctions"

import "./SingleMoveLine.scss"

const SingleMoveLine = React.memo(function (props) {
    return (
        <>
            <td
                className={"singlemove-line__first-cell text-center align-middle m-0 p-0 px-1 type-color" + props.MoveType + " text"} >
                {props.name + props.star}
            </td>
            {effectivenessData[props.MoveType].map((elem, i) => {
                let multipl = elem === 0 ? "1.000" : elem.toFixed(3);
                let rateStyle = returnVunStyle(multipl === "1.000" ? multipl : (1 / multipl).toFixed(3))

                return <td key={props.line + "offensive" + i}
                    className="m-0 p-0 align-middle" >
                    <div className={"singlemove-line__rate  rate-color" + rateStyle} >
                        {multipl}
                    </div>
                </td >
            })}
        </>
    )
});

export default SingleMoveLine;