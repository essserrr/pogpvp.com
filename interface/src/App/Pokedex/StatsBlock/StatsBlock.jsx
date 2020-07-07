import React from "react";
import LocalizedStrings from "react-localization";

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import Stat from "./Stat"

let strings = new LocalizedStrings(dexLocale);

const StatsBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="row m-0 p-0 mt-1 jystify-content-center">
            <Stat value={props.value.Atk} max={414} type={props.value.Type[0]} label={strings.atkFull} />
            <Stat value={props.value.Def} max={505} type={props.value.Type[0]} label={strings.defFull} />
            <Stat value={props.value.Sta} max={496} type={props.value.Type[0]} label={strings.staFull} />
        </div>
    )

});

export default StatsBlock;