import React from "react"
import LocalizedStrings from "react-localization"
import ReactTooltip from "react-tooltip"

import { constr } from "../../../../../locale/Pvp/Constructor/Constructor"
import { getCookie } from "../../../../../js/getCookie"

import "./ReconstructionButton.scss"

let constrStrings = new LocalizedStrings(constr)

const ReconstructionButton = React.memo(function (props) {
    constrStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <ReactTooltip
                className={"infoTip"}
                id={"constructorButton"} effect="solid"
                place={"top"}
                multiline={true}>
                {constrStrings.constructorTip}
            </ReactTooltip>
            <div
                data-tip data-for={"constructorButton"}
                onClick={props.onClick}
                className={"clickable ml-auto mb-1 constructor-button " + (props.enabled ? "on" : "")} >
                {constrStrings.contructor}
            </div>
        </>
    )
});

export default ReconstructionButton;