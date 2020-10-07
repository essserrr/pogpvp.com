import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../../../../../../../js/getCookie"
import { pveLocale } from "../../../../../../../../../locale/pveLocale"

let pveStrings = new LocalizedStrings(pveLocale)

const FightStats = React.memo(function (props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="row m-0 fBolder">
            {props.dAvg !== undefined && <div className="col-6 p-0 pr-1">
                <i className="fas fa-crosshairs mr-1"></i>
                {`${props.dAvg}%`}
                {props.dMin !== undefined && props.dMax !== undefined && ` (${props.dMin}% - ${props.dMax}%)`}
            </div>}
            {props.plAvg !== undefined && <div className="col-6 p-0">
                <i className="fas fa-users mr-1"></i>
                {`${props.plAvg}`}
                {props.plMin !== undefined && props.plMax !== undefined && ` (${props.plMin} - ${props.plMax})`}
            </div>}
            {props.dpsAvg !== undefined && <div className="col-6 p-0 pr-1">
                <i className="fab fa-cloudscale mr-1"></i>
                {`${props.dpsAvg}`}
                {props.dpsMin !== undefined && props.dpsMax !== undefined && ` (${props.dpsMin} - ${props.dpsMax})`}
            </div>}
            {props.FMin !== undefined && props.FMax !== undefined && <div className="col-6 p-0">
                <i className="fas fa-skull-crossbones mr-1"></i>
                {`${props.FMin} - ${props.FMax}`}
            </div>}
            {props.tAvg !== undefined && <div className="col-6 p-0">
                <i className="far fa-clock mr-1"></i>
                {`${props.tAvg}${pveStrings.s}`}
                {props.tMin !== undefined && props.tMax !== undefined && ` (${props.tMin}${pveStrings.s} - ${props.tMax}${pveStrings.s})`}
            </div>}
            {props.ttwAvg && <div className="col-6 p-0">
                <i className="far fa-hourglass mr-1"></i>
                {`${props.ttwAvg}${pveStrings.s}`}
            </div>}

        </div>
    )
});

export default FightStats;