import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"


let strings = new LocalizedStrings(dexLocale);

const CommonPve = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <tr>
                <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.tip.rd}</th>
                <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >{props.move.Damage}</td>
            </tr>
            <tr>
                <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.tip.re}</th>
                <td className="tableBorder align-middle m-0 p-0 py-1 dexFont" >{props.energy}</td>
            </tr>
            <tr>
                <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.tip.cd}</th>
                <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >{props.move.Cooldown / 1000}</td>
            </tr>
            <tr>
                <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.movecard.dwstart}</th>
                <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >{props.move.DamageWindow / 1000}</td>
            </tr>
            <tr>
                <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.movecard.dwdur}</th>
                <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >{props.move.DodgeWindow / 1000}</td>
            </tr>
            <tr>
                <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >{strings.movecard.dps}</th>
                <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >{
                    (props.move.Damage / (props.move.Cooldown / 1000)).toFixed(2)}</td>
            </tr>
        </>
    )

});

export default CommonPve;
