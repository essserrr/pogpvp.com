import React from "react"
import PlayerStatisticsWrapper from "./PlayerStatisticsWrapper/PlayerStatisticsWrapper"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../../../../js/getCookie"
import { pveLocale } from "../../../../../../../locale/pveLocale"

let pveStrings = new LocalizedStrings(pveLocale)

const StatisticsSet = React.memo(function (props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    return (
        <div className="row mx-0">
            <div className="col-12 px-0">
                <PlayerStatisticsWrapper
                    {...props}
                    value={props.value.avg}
                    title={`${pveStrings.playerAvg.avg}:`}
                    disableCollapse={true}
                />
            </div>
            <div className="col-12 px-0">
                <PlayerStatisticsWrapper
                    {...props}
                    value={props.value.max}
                    title={`${pveStrings.playerAvg.max}:`}
                    disableCollapse={true}
                />
            </div>
            <div className="col-12 px-0">
                <PlayerStatisticsWrapper
                    {...props}
                    value={props.value.min}
                    title={`${pveStrings.playerAvg.min}:`}
                    disableCollapse={false}
                />
            </div>
        </div>
    )
});



export default StatisticsSet;