import React from "react";
import TableIcon from "../MetrixTable/TableIcon"
import { returnVunStyle } from "../../..//../js/indexFunctions"


const SinglePokLine = React.memo(function (props) {
    return (
        <>
            <td className="tableBorder text-center theadT fixFirstRow m-0 p-0 px-1" >
                <TableIcon
                    letter="R"
                    j={props.i}
                    pok={props.pok}
                    pokemonTable={props.pokemonTable}
                    addStar={props.addStar}
                />
            </td>
            {props.vun[props.i].map((elem, k) => {
                let rateStyle = returnVunStyle(elem)
                return <td key={props.i + "defensive" + k} className="tableBorder matrixColor font80 m-0 p-0 align-middle" >
                    <div className={"rateSquare hover P  rateColor" + rateStyle}>
                        {elem}
                    </div>
                </td >
            })}
        </>
    )
});

export default SinglePokLine;