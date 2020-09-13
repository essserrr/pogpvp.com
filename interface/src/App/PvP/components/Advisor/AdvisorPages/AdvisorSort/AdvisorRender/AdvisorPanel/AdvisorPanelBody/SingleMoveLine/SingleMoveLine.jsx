import React from "react"
import { returnVunStyle, effectivenessData } from "../../../../../../../../../../js/indexFunctions"


const SingleMoveLine = React.memo(function (props) {
    return (
        <>
            <td
                className={"tableBorder text-center align-middle theadT fixFirstRow  m-0 p-0 px-1 typeColorC" + props.MoveType + " text"} >
                {props.name + props.star}
            </td>
            {effectivenessData[props.MoveType].map((elem, i) => {
                let multipl = elem === 0 ? "1.000" : elem.toFixed(3);
                let rateStyle = returnVunStyle(multipl === "1.000" ? multipl : (1 / multipl).toFixed(3))

                return <td key={props.line + "offensive" + i}
                    className="tableBorder matrixColor font80 m-0 p-0 align-middle" >
                    <div className={"rateSquare hover P  rateColor" + rateStyle} >
                        {multipl}
                    </div>
                </td >
            })}
        </>
    )
});

export default SingleMoveLine;