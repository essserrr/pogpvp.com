import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "js/getCookie"
import { dexLocale } from "locale/Movedex/Movecard"

let strings = new LocalizedStrings(dexLocale)

const QuickMove = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <tr>
            <th className="align-middle  m-0 p-0 py-1" scope="row" >{strings.movecard.eps}</th>
            <td className="align-middle  m-0 p-0 py-1" >{
                (Math.abs(props.move.Energy) / (props.move.Cooldown / 1000)).toFixed(2)}</td>
        </tr>
    )

});

export default QuickMove;
