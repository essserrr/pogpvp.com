import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"


let strings = new LocalizedStrings(dexLocale);

const Effect = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let effect = ""
    if (props.move.Subject !== "") {
        effect += (props.move.Probability * 100) + strings.ch

        for (let i = 0; i < props.move.Stat.length; i++) {
            effect += " " + strings[props.move.Stat[i]]
        }
        effect += strings.by + props.move.StageDelta
        effect += strings.of + strings[props.move.Subject]
    }
    return (
        <>
            <tr>
                <th className="modifiedBorderTable align-middle m-0 p-0 py-1 cardFirst" scope="row" >{strings.tip.ef}</th>
                <td className="modifiedBorderTable align-middle m-0 p-0 py-1 cardFirst" >{effect}</td>
            </tr>
        </>
    )

});

export default Effect;
