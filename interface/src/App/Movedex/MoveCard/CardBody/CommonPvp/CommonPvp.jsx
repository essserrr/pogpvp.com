import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "js/getCookie"
import { dexLocale } from "locale/Movedex/Movecard"


let strings = new LocalizedStrings(dexLocale);

const CommonRaid = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <tr>
                <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.tip.pd}</th>
                <td className="align-middle m-0 p-0 py-1" >{props.move.PvpDamage}</td>
            </tr>
            <tr>
                <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.tip.pe}</th>
                <td className="align-middle m-0 p-0 py-1" >{props.move.PvpEnergy}</td>
            </tr>
            <tr>
                <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.tip.dr}</th>
                <td className="align-middle m-0 p-0 py-1" >{props.move.PvpDurationSeconds / 0.5}</td>
            </tr>
        </>
    )

});

export default CommonRaid;
