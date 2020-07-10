import React from "react";
import LocalizedStrings from "react-localization";

import Button from "../../Movedex/Button/Button"
import { getCookie, encodeQueryData, calculateMaximizedStats, selectCharge, selectQuick } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

class RedirectBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.onClickRedirect = this.onClickRedirect.bind(this)
    }

    onClickRedirect(event) {
        switch (event.currentTarget.getAttribute("attr")) {
            case "pvp":
                let pokStats = calculateMaximizedStats(this.props.value.Title, 40, this.props.pokTable).great.Overall
                let quick = selectQuick(this.props.value.QuickMoves.map(move => { return { key: move } }),
                    this.props.moveTable, this.props.value.Title, this.props.pokTable)
                let charge = selectCharge(this.props.value.ChargeMoves.map(move => { return { key: move } }),
                    this.props.moveTable, this.props.value.Title, this.props.pokTable)
                let pokString = encodeQueryData(
                    this.generatePokObj(this.props.value.Title, pokStats, 0, false, quick, charge)
                )
                window.open("/pvp/single/great/" + pokString, "_blank")
                break
            default:
                window.open("/pve/common/_/" + encodeURIComponent(this.props.value.Title) + "___4/0_0_0_18_3_false", "_blank")
        }
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
        return (
            <div className={"row m-0 mt-2 mb-3 text-center sliderGroup justify-content-center"} >
                <Button
                    class="col sliderButton hv"
                    title={strings.pvpwith}
                    attr="pvp"
                    onClick={this.onClickRedirect}
                />
                <Button
                    class="col sliderButton hv"
                    title={strings.pvewith}
                    attr="pve"
                    onClick={this.onClickRedirect}
                />
            </div>
        );
    }
}

export default RedirectBlock;