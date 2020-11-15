import React from "react"
import HPIndicator from "./HPIndicator/HPIndicator"
import EnergyIndicator from "./EnergyIndicator/EnergyIndicator"
import EnergyNumber from "./EnergyNumber/EnergyNumber"
import { calculateDamage, calculateMultiplier } from "../../../../js/indexFunctions"
import { getCookie } from "../../../../js/getCookie"

import LocalizedStrings from "react-localization"
import { locale } from "../../../../locale/locale"
import { moveTips } from "locale/Pvp/MoveTips/MoveTips";

import "./Indicators.scss"

let strings = new LocalizedStrings(locale)
let moveStrings = new LocalizedStrings(moveTips);

const Indicators = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    moveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    return (
        <div className="indicators p-2">

            <HPIndicator value={props.HP} maxValue={props.effSta} />

            <div className="d-flex justify-content-around mt-2">
                {props.chargeMove1 &&
                    <EnergyIndicator value={props.energy} maxValue={-props.chargeMove1.PvpEnergy} move={props.chargeMove1}
                        damage={calculateDamage(props.chargeMove1.PvpDamage, props.aAttack, props.dDefence, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove1.MoveType))} />}

                <EnergyNumber
                    for={"energy" + props.attr}
                    value={props.energy}
                    label={"strings.initialStats.energyTip"}
                />

                {(props.chargeMove2) &&
                    <EnergyIndicator value={props.energy} maxValue={-props.chargeMove2.PvpEnergy} move={props.chargeMove2}
                        damage={calculateDamage(props.chargeMove2.PvpDamage, props.aAttack, props.dDefence, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove2.MoveType))} />}

            </div>
        </div>


    )

});

export default Indicators;