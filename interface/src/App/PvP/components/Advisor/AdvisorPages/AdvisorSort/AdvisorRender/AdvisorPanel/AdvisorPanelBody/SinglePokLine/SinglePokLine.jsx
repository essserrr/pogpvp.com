import React from "react"
import TableIcon from "../../../../../../../TableBodyRender/TableIcon/TableIcon"
import { returnVunStyle } from "../../../../../../../../../../js/indexFunctions"

import "./SinglePokLine.scss"

const SinglePokLine = React.memo(function (props) {
    return (
        <>
            <td className="singlepok-line__first-cell text-center m-0 p-0 px-1" >
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
                return <td key={props.i + "defensive" + k} className="m-0 p-0 align-middle" >
                    <div className={"singlepok-line__rate rateColor" + rateStyle}>
                        {elem}
                    </div>
                </td >
            })}
        </>
    )
});

export default SinglePokLine;