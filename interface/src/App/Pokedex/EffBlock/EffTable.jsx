import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const EffTable = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    console.log(props.value)
    return (
        <table>

        </table>
    )
});

export default EffTable;