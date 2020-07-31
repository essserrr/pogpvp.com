import React from "react";
import LocalizedStrings from "react-localization";

import { ReactComponent as Dust } from "../../../icons/stardust.svg";
import { ReactComponent as Candy } from "../../../icons/candy.svg";
import { getCookie } from "../../../js/getCookie"
import { dexLocale } from "../../../locale/dexLocale"
import { regionLocale } from "../../../locale/regionLocale"

let strings = new LocalizedStrings(dexLocale);
let regions = new LocalizedStrings(regionLocale);

const OtherTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    regions.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <table className={"table table-sm table-hover text-center mb-0 " + (props.class ? props.class : "")} >
            <tbody className="tableBorder ">
                {props.value.SecCharge && (props.value.SecCharge.Candy !== 0) && <tr>
                    <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >
                        {strings.infot.sec}
                    </th>
                    <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >
                        <Candy className="icon18 mr-1" /><span className="align-middle">{props.value.SecCharge.Candy}</span>{" + "}
                        <Dust className="icon18" /><span className="align-middle">{props.value.SecCharge.Dust}</span>
                    </td>
                </tr>}
                {props.value.Purification && (props.value.Purification.Candy !== 0) && <tr>
                    <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >
                        {strings.infot.pur}
                    </th>
                    <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >
                        <Candy className="icon18 mr-1" /><span className="align-middle">{props.value.Purification.Candy}</span>{" + "}
                        <Dust className="icon18 mr-1" /><span className="align-middle">{props.value.Purification.Dust}</span>
                    </td>
                </tr>}
                {(props.value.Buddy !== 0) && <tr>
                    <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >
                        {strings.infot.bud}
                    </th>
                    <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >
                        {props.value.Buddy}
                    </td>
                </tr>}
                {props.value.Region !== 0 && <tr>
                    <th className="tableBorder align-middle  m-0 p-0 py-1 dexFont" scope="row" >
                        {strings.infot.reg}
                    </th>
                    <td className="tableBorder align-middle  m-0 p-0 py-1 dexFont" >
                        {regions[props.value.Region]}
                    </td>
                </tr>}
            </tbody>
        </table>

    )
});

export default OtherTable;