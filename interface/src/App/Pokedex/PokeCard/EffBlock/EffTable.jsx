import React from "react"
import { effectivenessData } from "../../../../js/indexFunctions"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"
import EffIcon from "./EffIcon"

import "./EffTable.scss"

let strings = new LocalizedStrings(dexLocale)

const EffTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    let effective = []
    let weak = []
    effectivenessData.forEach((elem, i) => {
        let efficiency = 1
        //calculate eff
        switch (props.reverse) {
            case true:
                props.type.forEach((type) => {
                    efficiency *= (effectivenessData[type][i] === 0 ? 1 : effectivenessData[type][i])
                });
                break
            default:
                props.type.forEach((type) => {
                    efficiency *= (elem[type] === 0 ? 1 : elem[type])
                });
        }
        //push icon
        switch (true) {
            case efficiency > 1:
                weak.push(<EffIcon
                    key={i + "eff"}
                    i={i}
                    eff={efficiency.toFixed(3)} />)
                break
            case efficiency < 1:
                effective.push(<EffIcon
                    key={i + "weak"}
                    i={i}
                    eff={efficiency.toFixed(3)} />)
                break
            default:
        }
    });


    return (
        <table className={"eff-table table table-sm table-hover text-center"} >
            <tbody>
                {(props.reverse ? weak.length > 0 : effective.length > 0) && <tr>
                    <th className="align-middle py-1" scope="row" >
                        {props.reverse ? strings.dmore : strings.resist}
                    </th>
                    <td className="align-middle py-1" >
                        {props.reverse ? weak : effective}
                    </td>
                </tr>}
                {(props.reverse ? effective.length > 0 : weak.length > 0) && <tr>
                    <th className="align-middle py-1" scope="row" >
                        {props.reverse ? strings.dless : strings.weak}
                    </th>
                    <td className="align-middle py-1" >
                        {props.reverse ? effective : weak}
                    </td>
                </tr>}
            </tbody>
        </table>
    )
});

export default EffTable;