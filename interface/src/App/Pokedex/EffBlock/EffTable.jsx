import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import TypingThead from "../../PvP/components/Advisor/TypingThead"
import WeaknLine from "./WeaknLine"

let strings = new LocalizedStrings(dexLocale);

const EffTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    console.log(props.value)
    return (
        <table className="table mb-0 table-sm text-center table-responsive">
            <thead className="thead " >
                <tr >
                    <TypingThead />
                </tr>
            </thead>
            <tbody>
                <WeaknLine
                    type={props.type}
                    title={props.title}
                    reverse={props.reverse}
                />
            </tbody>
        </table>
    )
});

export default EffTable;