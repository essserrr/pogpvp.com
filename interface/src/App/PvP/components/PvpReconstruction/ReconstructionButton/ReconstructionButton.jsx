import React from "react"
import LocalizedStrings from "react-localization"
import ReactTooltip from "react-tooltip"

import { locale } from "../../../../../locale/locale"
import { getCookie } from "../../../../../js/getCookie"

import "./ReconstructionButton.scss"

let strings = new LocalizedStrings(locale)

const ReconstructionButton = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <ReactTooltip
                className={"infoTip"}
                id={"constructorButton"} effect="solid"
                place={"top"}
                multiline={true}>
                {strings.tips.constructor}
            </ReactTooltip>
            <div
                data-tip data-for={"constructorButton"}
                onClick={props.onClick}
                className={"clickable ml-auto mb-1 constructor-button " + (props.enabled ? "on" : "")} >
                {strings.reconstruction.contructor}
            </div>
        </>
    )
});

export default ReconstructionButton;