import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"


let strings = new LocalizedStrings(dexLocale);

const CommonRaid = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.tip.pd}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 dexFont" >{props.move.PvpDamage}</td>
            </tr>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.tip.pe}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 dexFont" >{props.move.PvpEnergy}</td>
            </tr>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.tip.dr}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 dexFont" >{props.move.PvpDurationSeconds / 0.5}</td>
            </tr>
        </>
    )

});

export default CommonRaid;
