import React from "react";
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import Type from "../../PvP/components/CpAndTypes/Type"
import { getCookie, typeDecoder } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale)

const MoveRow = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let effect = ""
    if (props.value.Subject !== "") {
        effect += (props.value.Probability * 100) + strings.ch

        props.value.Stat.forEach(function (elem) {
            effect += " " + strings[elem]
        });

        effect += strings.by + props.value.StageDelta
        effect += strings.of + strings[props.value.Subject]
    }
    return (
        <>
            <tr className="animShiny">
                <th className="align-middle text-center px-sm-1 max110 " scope="row">
                    <Link title={strings.dexentr + props.value.Title}
                        className="link"
                        to={(navigator.userAgent === "ReactSnap") ? "/" : "/movedex/id/" + encodeURIComponent(props.value.Title)}>
                        {props.value.Title}
                    </Link>
                </th>
                <td className="align-middle px-0 " >
                    <Type
                        class={"mx-1 icon18"}
                        code={props.value.MoveType}
                        value={typeDecoder[props.value.MoveType]}
                    /></td>
                <td className="align-middle fBolder px-0 borderLeft px-sm-1 px-md-3 " >{props.value.Damage}</td>
                <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.Energy}</td>
                <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.Cooldown / 1000}</td>
                <td className="align-middle fBolder px-0 borderLeft px-sm-1 px-md-3 " >{props.value.PvpDamage}</td>
                <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.PvpEnergy}</td>
                <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.PvpDurationSeconds / 0.5}</td>
                <td className="align-middle fBolder px-sm-1 max110" >{effect}</td>
            </tr>
        </>
    )

});

export default MoveRow;