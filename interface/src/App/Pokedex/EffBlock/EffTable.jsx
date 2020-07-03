import React from "react";
import { effectivenessData } from "../../../js/indexFunctions"
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import EffIcon from "./EffIcon"

let strings = new LocalizedStrings(dexLocale);


const EffTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    let effective = []
    let weak = []

    for (let i = 0; i < effectivenessData.length; i++) {
        let efficiency = 1
        //calculate eff
        switch (props.reverse) {
            case true:
                for (let j = 0; j < props.type.length; j++) {
                    efficiency *= (effectivenessData[props.type[j]][i] === 0 ? 1 : effectivenessData[props.type[j]][i])
                }
                break
            default:
                for (let j = 0; j < props.type.length; j++) {
                    efficiency *= (effectivenessData[i][props.type[j]] === 0 ? 1 : effectivenessData[i][props.type[j]])
                }
        }

        //push icon
        if (efficiency > 1) {
            weak.push(
                <EffIcon
                    key={i + "eff"}
                    i={i}
                    eff={efficiency.toFixed(3)}
                />)
        }
        if (efficiency < 1) {
            effective.push(
                <EffIcon
                    key={i + "weak"}
                    i={i}
                    eff={efficiency.toFixed(3)}
                />)
        }

    }

    return (
        <table className={"table table-sm table-hover text-center"} >
            <tbody className="modifiedBorderTable ">
                {(props.reverse ? weak.length > 0 : effective.length > 0) && <tr>
                    <th className="modifiedBorderTable align-middle  py-1 dexFont" scope="row" >
                        {props.reverse ? strings.dmore : strings.resist}
                    </th>
                    <td className="modifiedBorderTable align-middle  py-1" >
                        {props.reverse ? weak : effective}
                    </td>
                </tr>}
                {(props.reverse ? effective.length > 0 : weak.length > 0) && <tr>
                    <th className="modifiedBorderTable align-middle  py-1 dexFont" scope="row" >
                        {props.reverse ? strings.dless : strings.weak}
                    </th>
                    <td className="modifiedBorderTable align-middle  py-1" >
                        {props.reverse ? effective : weak}
                    </td>
                </tr>}
            </tbody>
        </table>
    )
});

export default EffTable;