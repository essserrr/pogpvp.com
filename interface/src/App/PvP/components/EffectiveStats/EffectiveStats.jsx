import React from "react"
import ReactTooltip from "react-tooltip"

import LocalizedStrings from "react-localization"
import { stats } from "../../../../locale/Components/Stats/locale"
import { getCookie } from "../../../../js/getCookie"

import "./EffectiveStats.scss"

let strings = new LocalizedStrings(stats)

const EffectiveStats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        < div className="row justify-content-between m-0 mt-2" style={{ fontSize: "92%" }}>
            <ReactTooltip
                id={props.attr + "effatk"} effect="solid">
                {strings.atkTip}
            </ReactTooltip>
            <ReactTooltip
                id={props.attr + "effdef"} effect="solid">
                {strings.defTip}
            </ReactTooltip>
            <ReactTooltip
                id={props.attr + "effsta"} effect="solid">
                {strings.staTip}
            </ReactTooltip>
            <div
                data-tip data-for={props.attr + "effatk"}
                className={"fBolder eff-stage" + (Number(props.AtkStage) + 4)}>
                {strings.atk} {props.effAtk}
            </div>
            <div
                data-tip data-for={props.attr + "effdef"}
                className={"fBolder eff-stage" + (Number(props.DefStage) + 4)}>
                {strings.def} {props.effDef}
            </div>
            <div
                data-tip data-for={props.attr + "effsta"}
                className="fBolder">
                {strings.sta} {props.effSta}
            </div>
        </div >
    )
});

export default EffectiveStats;