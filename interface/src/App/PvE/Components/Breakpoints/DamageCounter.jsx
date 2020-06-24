import React from "react";
import LocalizedStrings from 'react-localization';
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie } from "../../../../js/indexFunctions"

let pvestrings = new LocalizedStrings(pveLocale);

const DamageCounter = React.memo(function Pokemon(props) {
    pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <div className="col-12 m-0 p-0 text-center my-1">
                {pvestrings.damage}
            </div>
            <div className="col-12 m-0 p-0">
                {props.quickName}: <span className="fontBolder">{props.dQuick}</span>
                {((props.dQuick - props.baseQuick) > 0) && <span className="fontBolder">(+{props.dQuick - props.baseQuick})</span>}
            </div>
            <div className="col-12 m-0 p-0">
                {props.chargeName}: <span className="fontBolder">{props.dCharge}</span>
                {((props.dCharge - props.baseCharge) > 0) && <span className="fontBolder">(+{props.dCharge - props.baseCharge})</span>}
            </div>
        </>
    )

});

export default DamageCounter;