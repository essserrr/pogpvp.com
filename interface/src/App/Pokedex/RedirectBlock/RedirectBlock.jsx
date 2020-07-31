import React from "react";
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { encodeQueryData, calculateMaximizedStats, selectCharge, selectQuick } from "../../../js/indexFunctions"
import { getCookie } from "../../../js/getCookie"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale)

class RedirectBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    generatePokObj(name, stat, shields, isShadow, quick, charge) {
        return {
            name: name, Lvl: stat.Level, Atk: stat.Atk, Def: stat.Def, Sta: stat.Sta, Shields: shields,
            AtkStage: 0, DefStage: 0, InitialHP: 0, InitialEnergy: 0,
            IsGreedy: true, IsShadow: isShadow,
            QuickMove: quick, ChargeMove1: charge.primaryName, ChargeMove2: charge.secodaryName,
        }
    }

    render() {
        let pokStats = calculateMaximizedStats(this.props.value.Title, 40, this.props.pokTable).great.Overall
        let quick = selectQuick(this.props.value.QuickMoves.map(move => { return { key: move } }),
            this.props.moveTable, this.props.value.Title, this.props.pokTable)
        let charge = selectCharge(this.props.value.ChargeMoves.map(move => { return { key: move } }),
            this.props.moveTable, this.props.value.Title, this.props.pokTable)
        let pokString = encodeQueryData(
            this.generatePokObj(this.props.value.Title, pokStats, 0, false, quick, charge)
        )
        return (
            <div className={"row m-0 mt-2 mb-3 text-center sliderGroup justify-content-center"} >
                <Link style={{ color: "black" }}
                    className="col sliderButton hv"
                    to={navigator.userAgent === "ReactSnap" ? "/" : "/pvp/single/great/" + pokString}>
                    {strings.pvpwith}
                </Link>
                <Link style={{ color: "black" }}
                    className="col sliderButton hv" to={navigator.userAgent === "ReactSnap" ? "/" :
                        "/pve/common/_/" + encodeURIComponent(this.props.value.Title) + "___4/0_0_0_18_3_false"}>
                    {strings.pvewith}
                </Link>
            </div >
        );
    }
}

export default RedirectBlock;