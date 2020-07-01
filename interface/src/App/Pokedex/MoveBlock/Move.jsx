import React from "react";
import LocalizedStrings from 'react-localization';

import ChargeEnergy from "./ChargeEnergy"
import { getCookie, typeDecoder } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const Move = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    let mColor = "typeColor color" + props.value.MoveType + " text"
    let isElite = props.pok.EliteMoves[props.value.Title] === 1 || props.value.Title === "Return"
    return (
        <a className={"col-12 d-flex p-0 my-2"}
            title={strings.dexentr + props.value.Title}
            href={(navigator.userAgent === "ReactSnap") ? "/" : "/movedex/id/" + encodeURIComponent(props.value.Title)}
        >
            <div className={"col-3 text-center dexFont col-md-2 p-1 mr-1 " + mColor} style={{ borderRadius: "3px 0px 0px 3px" }}>
                DPS
                < div >
                    {(props.value.Damage / (props.value.Cooldown / 1000)).toFixed(1)}
                </div>
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
                {props.value.MoveCategory === "Charge Move" && <div className="col-12 p-0">
                    <ChargeEnergy move={props.value} />
                </div>}
            </div>
        </a >
    )
});

export default Move;