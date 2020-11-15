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

    if (props.chargeMove1) {
        var damage1 = calculateDamage(props.chargeMove1.PvpDamage, props.aAttack, props.dDefence, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove1.MoveType))
    }
    if (props.chargeMove2) {
        var damage2 = calculateDamage(props.chargeMove2.PvpDamage, props.aAttack, props.dDefence, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove2.MoveType))
    }
    return (
        <div className="indicators p-2">

            <HPIndicator value={props.HP} maxValue={props.effSta} />

            <div className="d-flex justify-content-around mt-2">
                {(props.chargeMove1) && <EnergyIndicator
                    what="Energy"
                    value={props.energy}
                    defaultValue={0}
                    maxValue={-props.chargeMove1.PvpEnergy}
                    moveName={props.chargeMove1.Title.replace(/[a-z -]/g, "")}
                    moveType={props.chargeMove1.MoveType}
                    for={"ChM1En" + props.attr}
                    tip={<>
                        {moveStrings.move.damage + damage1}<br />
                        {moveStrings.move.energy + (-props.chargeMove1.PvpEnergy)}<br />
                        {"DPE: " + (damage1 / (-props.chargeMove1.PvpEnergy)).toFixed(2)}
                    </>
                    }
                />}
                <EnergyNumber
                    for={"energy" + props.attr}
                    value={props.energy}
                    label={"strings.initialStats.energyTip"}
                />
                {(props.chargeMove2) && <EnergyIndicator
                    what="Energy"
                    value={props.energy}
                    defaultValue={0}
                    maxValue={-props.chargeMove2.PvpEnergy}
                    moveName={props.chargeMove2.Title.replace(/[a-z -]/g, "")}
                    moveType={props.chargeMove2.MoveType}
                    for={"ChM2En" + props.attr}
                    tip={<>
                        {moveStrings.move.damage + damage2}<br />
                        {moveStrings.move.energy + (-props.chargeMove2.PvpEnergy)}<br />
                        {"DPE: " + (damage2 / (-props.chargeMove2.PvpEnergy)).toFixed(2)}
                    </>
                    }
                />}
            </div>
        </div>


    )

});

export default Indicators;