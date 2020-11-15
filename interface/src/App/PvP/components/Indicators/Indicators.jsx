import React from "react";

import Grid from '@material-ui/core/Grid';




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
            <Grid container alignItems="center" justify={"space-around"} spacing={1}>

                <Grid item xs={12}>
                    <HPIndicator value={props.HP} maxValue={props.effSta} />
                </Grid>

                <Grid item xs="auto">
                    {props.chargeMove1 &&
                        <EnergyIndicator value={props.energy} maxValue={-props.chargeMove1.PvpEnergy} move={props.chargeMove1}
                            damage={calculateDamage(props.chargeMove1.PvpDamage, props.aAttack, props.dDefence, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove1.MoveType))} />}
                </Grid>
                <Grid item xs="auto">
                    <EnergyNumber value={props.energy} />
                </Grid>

                <Grid item xs="auto">
                    {props.chargeMove2 &&
                        <EnergyIndicator value={props.energy} maxValue={-props.chargeMove2.PvpEnergy} move={props.chargeMove2}
                            damage={calculateDamage(props.chargeMove2.PvpDamage, props.aAttack, props.dDefence, calculateMultiplier(props.attackerTypes, props.defenderTypes, props.chargeMove2.MoveType))} />}
                </Grid>

            </Grid>
        </div>
    )
});

export default Indicators;