import React from "react";
import LocalizedStrings from "react-localization";

import Effect from "./Effect/Effect"

import { getCookie } from "js/getCookie"
import { dexLocale } from "locale/Movedex/Movecard"

let strings = new LocalizedStrings(dexLocale)

const ChargeMovePvp = React.memo(function ChargeMovePvp(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <tr>
                <th className="align-middle m-0 p-0 py-1" scope="row" >{strings.movecard.dpe}</th>
                <td className="align-middle m-0 p-0 py-1" >{
                    (props.move.PvpDamage / Math.abs(props.move.PvpEnergy)).toFixed(2)}</td>
            </tr>
            {props.move.Subject ? <Effect
                move={props.move}
            /> : null}
        </>
    )

});

export default ChargeMovePvp;
