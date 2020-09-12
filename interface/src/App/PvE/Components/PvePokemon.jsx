import React from "react"


import SearchableSelect from "../../PvP/components/SearchableSelect/SearchableSelect"
import Stats from "../../PvP/components/Stats/Stats"
import SelectGroup from "../../PvP/components/SelectGroup/SelectGroup"
import MagicBox from "../../PvP/components/MagicBox/MagicBox"
import CpAndTyping from "../../PvP/components/CpAndTypes/CpAndTypes"
import Checkbox from "../../RaidsList/Checkbox/Checkbox"


import LocalizedStrings from "react-localization"
import { locale } from "../../../locale/locale"
import { pveLocale } from "../../../locale/pveLocale"
import { getCookie } from "../../../js/getCookie"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale)

class PvePokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0 justify-content-center align-items-center">
                {(this.props.value.showMenu) && <MagicBox
                    title={strings.title.selectMove}
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={<SearchableSelect
                        list={this.props.value.isSelected && this.props.value.isSelected.includes("Charge") ? this.props.chargeMoveList : this.props.quickMoveList}
                        attr={this.props.attr}
                        category={this.props.value.isSelected}
                        onChange={this.props.onChange}
                    />}
                />}


                {(this.props.pokemonTable[this.props.value.Name]) &&
                    <div className="col-12 px-0  my-1">
                        <CpAndTyping
                            class="d-flex dont90 justify-content-center align-items-center"

                            Lvl={this.props.value.Lvl}
                            Atk={this.props.value.Atk}
                            Def={this.props.value.Def}
                            Sta={this.props.value.Sta}

                            pokemonTable={this.props.pokemonTable}
                            name={this.props.value.Name}
                            tier={this.props.value.Tier}
                            isBoss={this.props.attr === "bossObj"}
                        />
                    </div>}


                <div className="col-12 px-0 my-1">
                    <div className="row mx-0 justify-content-between align-items-center">
                        {this.props.pokList &&
                            <div className={this.props.colSize ? this.props.colSize : "col-6 px-1"}>
                                <SearchableSelect
                                    value={this.props.value.Name}
                                    list={this.props.pokList}
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                />
                            </div>}
                        {this.props.attr !== "bossObj" &&
                            <div className={this.props.colSize ? this.props.colSize : "col-6 px-1"}>
                                <Stats
                                    class="font95 input-group input-group-sm"

                                    Lvl={this.props.value.Lvl}
                                    Atk={this.props.value.Atk}
                                    Def={this.props.value.Def}
                                    Sta={this.props.value.Sta}
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                />
                            </div>}

                        {this.props.attr === "bossObj" &&
                            <div className="col-6 px-1">
                                <SelectGroup
                                    class="input-group input-group-sm"
                                    name="Tier"
                                    value={this.props.value.Tier}
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                    options={
                                        <>
                                            <option value="0" key="0">{pveStrings.tierlist + " 1"}</option>
                                            <option value="2" key="2">{pveStrings.tierlist + " 3"}</option>
                                            <option value="4" key="4">{pveStrings.tierlist + " 5"}</option>
                                            <option value="4" key="5">{pveStrings.mega}</option>
                                            <option value="5" key="6">{pveStrings.tierlist + " 5.5"}</option>
                                        </>
                                    }

                                    labelWidth="88px"
                                    label={pveStrings.tier}
                                    place={"top"}
                                    for={"bossTier"}

                                    tip={<>
                                        <div key="tiertip">
                                            Max HP:<br />
                                            {pveStrings.tierlist + " 1 - 600 HP"}<br />
                                            {pveStrings.tierlist + " 3 - 3600 HP"}<br />
                                            {pveStrings.tierlist + " 5 - 15000 HP"}<br />
                                            {pveStrings.mega + " - 15000 HP"}<br />
                                            {pveStrings.tierlist + " 5.5 - 22500 HP"}<br />
                                        </div>
                                    </>}
                                    tipClass="infoTip"
                                />
                            </div>}
                    </div>
                </div>





                <div className={this.props.colSize ? this.props.colSize : "col-6 px-1  my-1"}>
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="QuickMove"
                        value={this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined &&
                            this.props.value.QuickMove}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={this.props.value.quickMovePool}

                        labelWidth="88px"
                        label={strings.title.quickMove}
                        labelStyle={(this.props.moveTable[this.props.value.QuickMove] !== undefined) ?
                            `typeColorC${this.props.moveTable[this.props.value.QuickMove].MoveType} text` : ""}

                        place={"top"}
                        for={"QuickMove" + this.props.attr}
                        tip={<>{strings.tips.quick}<br />
                            {this.props.value.QuickMove && this.props.moveTable[this.props.value.QuickMove] !== undefined && <>
                                {strings.move.damage + (this.props.moveTable[this.props.value.QuickMove].Damage)}<br />
                                {strings.move.energy + (this.props.moveTable[this.props.value.QuickMove].Energy)}<br />
                                {"Cooldown: " + (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)}<br />
                                {"DPS: " + (this.props.moveTable[this.props.value.QuickMove].Damage /
                                    (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                                {"EPS: " + (this.props.moveTable[this.props.value.QuickMove].Energy /
                                    (this.props.moveTable[this.props.value.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                            </>}</>}
                        tipClass="infoTip"
                    />
                </div>
                <div className={this.props.colSize ? this.props.colSize : "col-6 px-1 my-1"}>
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="ChargeMove"
                        value={(this.props.value.ChargeMove && this.props.value.ChargeMove !== "Select..."
                            && this.props.moveTable[this.props.value.ChargeMove] !== undefined) ? this.props.value.ChargeMove : ""}

                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={this.props.value.chargeMovePool}

                        labelWidth="88px"
                        label={strings.title.chargeMove}
                        labelStyle={(this.props.moveTable[this.props.value.ChargeMove] !== undefined) ?
                            `typeColorC${this.props.moveTable[this.props.value.ChargeMove].MoveType} text` : ""}

                        place={"top"}
                        for={"ChargeMove" + this.props.attr}

                        tip={<>{strings.tips.charge}<br />
                            {(this.props.value.ChargeMove && this.props.value.ChargeMove !== "Select...") &&
                                this.props.moveTable[this.props.value.ChargeMove] !== undefined &&
                                <>
                                    {strings.move.damage + (this.props.moveTable[this.props.value.ChargeMove].Damage)}<br />
                                    {strings.move.energy + (-this.props.moveTable[this.props.value.ChargeMove].Energy)}<br />
                                    {"Cooldown: " + (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000)}<br />
                                    {"DPS: " + (this.props.moveTable[this.props.value.ChargeMove].Damage / (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000)).toFixed(2)}<br />
                                    {"DPS*DPE: " + (this.props.moveTable[this.props.value.ChargeMove].Damage /
                                        (this.props.moveTable[this.props.value.ChargeMove].Cooldown / 1000) *
                                        this.props.moveTable[this.props.value.ChargeMove].Damage /
                                        -this.props.moveTable[this.props.value.ChargeMove].Energy).toFixed(2)}<br />
                                </>}</>}
                        tipClass="infoTip"
                    />
                </div>



                {this.props.canBeShadow && <div className={(this.props.colSize ? this.props.colSize : "col-6 px-1 my-1") + (this.props.attr === "editPokemon" ? " order-2" : "")}>
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="IsShadow"
                        value={this.props.value.IsShadow}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={
                            <>
                                <option value="false" key="Normal">{strings.options.type.normal}</option>
                                <option value="true" key="Shadow">{strings.options.type.shadow}</option>
                            </>}

                        labelWidth="88px"
                        label={strings.title.type}

                        place={"top"}
                        for={this.props.attr + "attackerIsShadow"}

                        tip={strings.tips.shadow}
                        tipClass="infoTip"
                    />
                </div>}




                {this.props.hasSecondCharge && <div
                    className={(this.props.colSize ? this.props.colSize : "col-6 px-1 my-1") + (this.props.attr === "editPokemon" ? " order-1" : "")}>
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="ChargeMove2"
                        value={(this.props.value.ChargeMove2 && this.props.value.ChargeMove2 !== "Select..."
                            && this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ? this.props.value.ChargeMove2 : ""}

                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={this.props.value.chargeMovePool}

                        labelWidth="88px"
                        label={strings.title.chargeMove}
                        labelStyle={(this.props.moveTable[this.props.value.ChargeMove2] !== undefined) ?
                            `typeColorC${this.props.moveTable[this.props.value.ChargeMove2].MoveType} text` : ""}

                        place={"top"}
                        for={"ChargeMove" + this.props.attr}

                        tip={<>{strings.tips.charge}<br />
                            {(this.props.value.ChargeMove2 && this.props.value.ChargeMove2 !== "Select...") &&
                                this.props.moveTable[this.props.value.ChargeMove2] !== undefined &&
                                <>
                                    {strings.move.damage + (this.props.moveTable[this.props.value.ChargeMove2].Damage)}<br />
                                    {strings.move.energy + (-this.props.moveTable[this.props.value.ChargeMove2].Energy)}<br />
                                    {"Cooldown: " + (this.props.moveTable[this.props.value.ChargeMove2].Cooldown / 1000)}<br />
                                    {"DPS: " + (this.props.moveTable[this.props.value.ChargeMove2].Damage / (this.props.moveTable[this.props.value.ChargeMove2].Cooldown / 1000)).toFixed(2)}<br />
                                    {"DPS*DPE: " + (this.props.moveTable[this.props.value.ChargeMove2].Damage /
                                        (this.props.moveTable[this.props.value.ChargeMove2].Cooldown / 1000) *
                                        this.props.moveTable[this.props.value.ChargeMove2].Damage /
                                        -this.props.moveTable[this.props.value.ChargeMove2].Energy).toFixed(2)}<br />
                                </>}</>}
                        tipClass="infoTip"
                    />
                </div>}
                {this.props.canBeShadow && this.props.attr === "attackerObj" && <div className="col-6 px-1 my-1">
                    <Checkbox
                        class={"form-check form-check-inline m-0 p-0"}
                        checked={this.props.settingsValue.SupportSlotEnabled !== "false" ? "checked" : false}
                        attr={"pveObj"}
                        name={"SupportSlotEnabled"}
                        label={
                            <div className=" text-center">
                                {pveStrings.supen}
                            </div>
                        }
                        onChange={this.props.onChange}
                    />
                </div>}
            </div>
        )
    }

}

export default PvePokemon