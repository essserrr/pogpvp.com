import React from "react";
import LocalizedStrings from "react-localization";

import { getCookie } from "js/getCookie"
import { dexLocale } from "locale/Movedex/Movecard"

let strings = new LocalizedStrings(dexLocale)

const ChargeMovePve = React.memo(function ChargeMovePve(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <tr>
                <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.movecard.dpe}</th>
                <td className="align-middle m-0 p-0 py-1" >{
                    (props.move.Damage / Math.abs(props.move.Energy)).toFixed(2)}</td>
            </tr>
            <tr>
                <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.movecard.dpsdpe}</th>
                <td className="align-middle m-0 p-0 py-1" >{
                    ((props.move.Damage / (props.move.Cooldown / 1000)) * (props.move.Damage / Math.abs(props.move.Energy))).toFixed(2)}</td>
            </tr>
        </>
    )

});

export default ChargeMovePve;
