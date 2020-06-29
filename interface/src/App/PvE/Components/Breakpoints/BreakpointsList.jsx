import React from "react";

import LocalizedStrings from 'react-localization';
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie, pveDamage, returnEffAtk, getPveMultiplier } from "../../../../js/indexFunctions"

let pvestrings = new LocalizedStrings(pveLocale);


const BreakpointsList = React.memo(function (props) {
    pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let multiplier = getPveMultiplier(props.attacker.Type, props.boss.Type, props.move.MoveType, props.weather, props.friend)
    let baseDamage = pveDamage(props.move.Damage, returnEffAtk(props.Atk, props.attacker.Atk, props.Lvl, props.IsShadow), props.effDef, multiplier)
    let arr = []

    for (let i = Number(props.Lvl); i <= 45; i += 0.5) {
        let damage = pveDamage(props.move.Damage, returnEffAtk(props.Atk, props.attacker.Atk, i, props.IsShadow), props.effDef, multiplier)

        if (damage > baseDamage) {
            baseDamage = damage
            arr.push(
                <div className="col-12 text-center m-0 p-0" key={i + "" + damage}>
                    {pvestrings.lvl}: <span className="fontBolder">{Number(i).toFixed(1)}</span> {pvestrings.damage}: <span className="fontBolder">{damage}</span>
                </div>
            )
        }
    }

    return (
        arr.length > 0 && <>
            <div className={"col-12 m-0 p-0 text-center font90 borderTop mt-1 pt-1"} >
                {pvestrings.qbreak} <span className="fontBolder">{props.move.Title}</span>
            </div>
            {arr}

        </>
    )

});

export default BreakpointsList;