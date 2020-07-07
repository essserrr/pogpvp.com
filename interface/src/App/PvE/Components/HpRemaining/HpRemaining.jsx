import React from "react";
import LocalizedStrings from "react-localization";

import { getCookie } from "../../../../js/indexFunctions"
import { pveLocale } from "../../../../locale/pveLocale"

let pveStrings = new LocalizedStrings(pveLocale);

const HpRemaining = React.memo(function (props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            {props.locale}{(props.tierHP - props.DAvg)}
            {" (" + (props.tierHP - props.DMax) + "-" + (props.tierHP - props.DMin) + ")"}
            <span className="ml-1 bigText">{props.NOfWins > 0 ? " " + pveStrings.winrate + " " + props.NOfWins + "%" : ""}</span>
        </>
    )
});

export default HpRemaining;