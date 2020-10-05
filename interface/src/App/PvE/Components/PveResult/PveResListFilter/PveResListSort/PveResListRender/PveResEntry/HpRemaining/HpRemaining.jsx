import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../../../../../../js/getCookie"
import { pveLocale } from "../../../../../../../../../locale/pveLocale"

import "./HpRemaining.scss"

let pveStrings = new LocalizedStrings(pveLocale)

const HpRemaining = React.memo(function (props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className="hp-remaining col-12 px-0 ">
            {`${pveStrings.hprem}${props.avg}`}
            {(props.max !== undefined && props.min !== undefined) && ` (${props.max}-${props.min})`}
            {props.nbOfWins > 0 && <span className="hp-remaining__win ml-1">{` ${pveStrings.winrate} ${props.nbOfWins}%`}</span>}
        </div>
    )
});

export default HpRemaining;