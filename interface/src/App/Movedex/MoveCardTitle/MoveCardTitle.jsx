import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../js/getCookie"
import { dexLocale } from "../../../locale/dexLocale"
import Type from "../../PvP/components/CpAndTypes/Type"

import "./MoveCardTitle.scss"

let strings = new LocalizedStrings(dexLocale)

const MoveCardTitle = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="movecard-title row m-0 p-0 pb-1 mb-2">
            <Type
                class={"ml-2  mr-1 icon24 align-self-center"}
                code={props.move.MoveType}
            />
            <h3 className={"align-self-center m-0"}>
                {props.move.Title}
            </h3>
            <h5 className={"align-self-center m-0 ml-1"}>
                ({props.move.MoveCategory === "Charge Move" ? strings.chm : strings.qm})
            </h5>
        </div>
    )

});

export default MoveCardTitle;