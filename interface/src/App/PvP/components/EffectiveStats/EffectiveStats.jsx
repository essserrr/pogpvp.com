import React from "react";
import ReactTooltip from "react-tooltip"

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

const EffectiveStats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <ReactTooltip effect='solid' />
            < div className="defaultFont mt-2" >
                <div
                    data-tip={strings.effStats.atkTip}
                    className={"d-inline mr-3 stageColor" + (Number(props.AtkStage) + 4)}>
                    {strings.effStats.atk} {props.effAtk}
                </div>
                <div
                    data-tip={strings.effStats.defTip}
                    className={"d-inline mr-3 stageColor" + (Number(props.DefStage) + 4)}>
                    {strings.effStats.def} {props.effDef}
                </div>
                <div
                    data-tip={strings.effStats.staTip}
                    className="d-inline">
                    {strings.effStats.sta} {props.effSta}
                </div>
            </div >
        </>


    )

});

export default EffectiveStats;