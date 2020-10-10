import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../../../../../../js/getCookie"
import { pveLocale } from "../../../../../../../../../locale/pveLocale"

import "./PlayersImpact.scss"

let pveStrings = new LocalizedStrings(pveLocale)

const PlayersImpact = React.memo(function (props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="player-impact row mx-0">
            <div className="col-12 px-0">
                {`${pveStrings.playerAvg.byPlayer}: `}
                {props.impact.map((value, key, array) => `${(value.dAvg / props.bossHP * 100).toFixed(1)}% (#${key + 1})${key !== array.length - 1 ? ", " : ""}`)}
            </div>
        </div>
    )
});

export default PlayersImpact;