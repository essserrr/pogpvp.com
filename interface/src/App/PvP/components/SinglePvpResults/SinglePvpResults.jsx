import React from "react"
import LocalizedStrings from "react-localization"

import Line from "./Line"
import Thead from "./Thead"

import { locale } from "../../../../locale/locale"
import { returnRateStyle } from "../../../../js/indexFunctions"
import { getCookie } from "../../../../js/getCookie"

import "./SinglePvpResults.scss"

let strings = new LocalizedStrings(locale)

const SinglePvpResults = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <table className={"singlepvp-table table table-sm table-hover text-center mb-0 " + (props.class ? props.class : "")} >
            <Thead
                NameA={props.value.Attacker.Name}
                NameD={props.value.Defender.Name}
            />
            <tbody className="singlepvp-res__tbody">
                <Line
                    title={strings.resultTable.rate}
                    valueA={<div className={"singlepvp-res__rate rate-color" + returnRateStyle(props.value.Attacker.Rate)[1]}>
                        <i className="fas fa-trophy mr-1"></i>
                        {props.value.Attacker.Rate}
                    </div>}
                    valueD={<div className={"singlepvp-res__rate rate-color" + returnRateStyle(props.value.Defender.Rate)[1]}>
                        <i className="fas fa-trophy mr-1"></i>
                        {props.value.Defender.Rate}
                    </div>}
                />
                <Line
                    title={strings.resultTable.hpRes}
                    valueA={props.value.Attacker.MaxHP + "/" + props.value.Attacker.HP}
                    valueD={props.value.Defender.MaxHP + "/" + props.value.Defender.HP}
                />
                <Line
                    title={strings.resultTable.damageRes}
                    valueA={(props.value.Attacker.MaxHP - props.value.Attacker.HP) + "/" + props.value.Defender.DamageBlocked}
                    valueD={(props.value.Defender.MaxHP - props.value.Defender.HP) + "/" + props.value.Attacker.DamageBlocked}
                />
                <Line
                    title={strings.resultTable.energyRes}
                    valueA={(props.value.Attacker.EnergyRemained + props.value.Attacker.EnergyUsed) + "/" + props.value.Attacker.EnergyUsed}
                    valueD={(props.value.Defender.EnergyRemained + props.value.Defender.EnergyUsed) + "/" + props.value.Defender.EnergyUsed}
                />
            </tbody>
        </table>
    )
});

export default SinglePvpResults;