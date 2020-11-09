import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/Movedex/Movecard"


let strings = new LocalizedStrings(dexLocale);

const Effect = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let effect = ""
    if (props.move.Subject !== "") {
        effect += (props.move.Probability * 100) + strings.ch

        props.move.Stat.forEach(function (elem) {
            effect += " " + strings[elem]
        });

        effect += strings.by + props.move.StageDelta
        effect += strings.of + strings[props.move.Subject]
    }
    return (
        <>
            <tr>
                <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.tip.ef}</th>
                <td className="align-middle m-0 p-0 py-1" >{effect}</td>
            </tr>
        </>
    )

});

export default Effect;
