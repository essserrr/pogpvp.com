import React from "react";
import LocalizedStrings from 'react-localization';

import Type from "../../PvP/components/CpAndTypes/Type"
import { getCookie, typeDecoder } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const MoveRow = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let effect = ""
    if (props.value.Subject !== "") {
        effect += (props.value.Probability * 100) + strings.ch

        for (let i = 0; i < props.value.Stat.length; i++) {
            effect += " " + strings[props.value.Stat[i]]
        }
        effect += strings.by + props.value.StageDelta
        effect += strings.of + strings[props.value.Subject]
    }
    return (
        <tr className="animShiny" key={props.value.Title}>
            <th className="text-center text-sm-left px-sm-1 widthLimit150" key={props.value.Title} scope="row">
                {props.value.Title}
            </th>
            <td className="px-0" value={props.value.MoveType}>
                <Type
                    class={"mx-1 icon18"}
                    code={props.value.MoveType}
                    value={typeDecoder[props.value.MoveType]}
                /></td>
            <td className="px-0 px-sm-1" value={props.value.Damage}>{props.value.Damage}</td>
            <td className="px-0 px-sm-1" value={props.value.Energy}>{props.value.Energy}</td>
            <td className="px-0 px-sm-1" value={props.value.Cooldown}>{props.value.Cooldown / 1000}</td>
            <td className="px-0 px-sm-1" value={props.value.PvpDamage}>{props.value.PvpDamage}</td>
            <td className="px-0 px-sm-1" value={props.value.PvpEnergy}>{props.value.PvpEnergy}</td>
            <td className="px-0 px-sm-1" value={props.value.PvpDuration}>{props.value.PvpDuration}</td>
            <td className="px-sm-1" value={props.value.Probability}>{effect}</td>
        </tr>
    )

});

export default MoveRow;