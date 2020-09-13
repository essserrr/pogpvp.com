import React from "react"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import ChargeEnergy from "./PokedexChargeEnergy/PokedexChargeEnergy"
import { typeDecoder } from "../../../../js/indexFunctions"
import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale)

const Move = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let mColor = "typeColorC" + props.value.MoveType + " text"
    let isElite = props.pok.EliteMoves[props.value.Title] === 1 || props.value.Title === "Return"
    return (
        <Link className={"col-12 d-flex p-0 my-2"}
            title={strings.dexentr + props.value.Title}
            to={(navigator.userAgent === "ReactSnap") ? "/" : "/movedex/id/" + encodeURIComponent(props.value.Title)}>
            <div className={"col-3 col-md-2 text-center dexFont p-1 mr-1 " + mColor} style={{ borderRadius: "3px 0px 0px 3px" }}>
                DPS<br />
                {(props.value.Damage / (props.value.Cooldown / 1000)).toFixed(1)}
            </div>
            <div className={"col-9 col-md-10 py-1 px-2 " + mColor} style={{ borderRadius: "0px 3px 3px 0px" }}>
                <div className={"col-12 dexFont p-0"}                >
                    {props.value.Title}{isElite ? "*" : ""}
                </div>
                <div className="col-12 dexFontSm p-0">
                    {typeDecoder[props.value.MoveType]}{"/"}
                    {strings.dabbr}:{props.value.Damage}{"/"}
                    {strings.cdabbr}:{props.value.Cooldown / 1000}{strings.s}
                    {props.value.MoveCategory === "Fast Move" ? "/EPS:" + (props.value.Energy / (props.value.Cooldown / 1000)).toFixed(1) : ""}
                </div>
                {props.value.MoveCategory === "Charge Move" && <ChargeEnergy move={props.value} />}
            </div>
        </Link>
    )
});

export default Move;