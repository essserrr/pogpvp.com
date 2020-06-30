import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"


let strings = new LocalizedStrings(dexLocale);

const CommonPve = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" scope="row" >{strings.tip.rd}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" >{props.move.Damage}</td>
            </tr>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" scope="row" >{strings.tip.re}</th>
                <td className="modifiedBorderTable align-middle m-0 p-0 py-1 fBolder" >{props.energy}</td>
            </tr>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" scope="row" >{strings.tip.cd}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" >{props.move.Cooldown / 1000}</td>
            </tr>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" scope="row" >{strings.movecard.dwstart}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" >{props.move.DamageWindow / 1000}</td>
            </tr>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" scope="row" >{strings.movecard.dwdur}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" >{props.move.DodgeWindow / 1000}</td>
            </tr>
            <tr>
                <th className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" scope="row" >{strings.movecard.dps}</th>
                <td className="modifiedBorderTable align-middle  m-0 p-0 py-1 fBolder" >{
                    (props.move.Damage / (props.move.Cooldown / 1000)).toFixed(2)}</td>
            </tr>
        </>
    )

});

export default CommonPve;
