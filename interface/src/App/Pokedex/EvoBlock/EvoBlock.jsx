import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const EvoBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    function generateMoves() {
        let arr = []
        arr.push(props.familyName)

        console.log(props.value)
        for (const [key, value] of Object.entries(props.value)) {
            console.log(key, value)
        }
        return arr
    }
    return (
        <div className={"col-12"}>
            {generateMoves()}
        </div>
    )

});

export default EvoBlock;