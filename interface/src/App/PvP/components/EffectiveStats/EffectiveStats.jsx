import React from "react";
import ReactTooltip from "react-tooltip"

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

const EffectiveStats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        < div className="defaultFont mt-2" >
            <ReactTooltip
                id={props.attr + "effatk"} effect='solid'>
                {strings.effStats.atkTip}
            </ReactTooltip>
            <ReactTooltip
                id={props.attr + "effdef"} effect='solid'>
                {strings.effStats.defTip}
            </ReactTooltip>
            <ReactTooltip
                id={props.attr + "effsta"} effect='solid'>
                {strings.effStats.staTip}
            </ReactTooltip>
            <div
                data-tip data-for={props.attr + "effatk"}
                className={"d-inline mr-3 fBolder stageColor" + (Number(props.AtkStage) + 4)}>
                {strings.effStats.atk} {props.effAtk}
            </div>
            <div
                data-tip data-for={props.attr + "effdef"}
                className={"d-inline mr-3 fBolder stageColor" + (Number(props.DefStage) + 4)}>
                {strings.effStats.def} {props.effDef}
            </div>
            <div
                data-tip data-for={props.attr + "effsta"}
                className="d-inline fBolder">
                {strings.effStats.sta} {props.effSta}
            </div>
        </div >
    )
});

export default EffectiveStats;