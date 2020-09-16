import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../../../../../../js/getCookie"
import { pveLocale } from "../../../../../../../../../locale/pveLocale"

import "./HpRemaining.scss"

let pveStrings = new LocalizedStrings(pveLocale)

const HpRemaining = React.memo(function (props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            {props.locale}{(props.tierHP - props.DAvg)}
            {" (" + (props.tierHP - props.DMax) + "-" + (props.tierHP - props.DMin) + ")"}
            <span className="hp-remaining ml-1">{props.NOfWins > 0 ? " " + pveStrings.winrate + " " + props.NOfWins + "%" : ""}</span>
        </>
    )
});

export default HpRemaining;