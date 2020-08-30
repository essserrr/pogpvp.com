import React from "react";
import SearchableSelect from "../../PvP/components/SearchableSelect/SearchableSelect"
import Stats from "../../PvP/components/Stats/Stats"
import SelectGroup from "../../PvP/components/SelectGroup/SelectGroup"
import MagicBox from "../../PvP/components/MagicBox/MagicBox"
import CpAndTyping from "../../PvP/components/CpAndTypes/CpAndTypes"


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
                {(this.props.value[this.props.attr].showMenu) && <MagicBox
                    title={strings.title.selectMove}
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={<SearchableSelect
                        list={this.props.value[this.props.attr].isSelected && this.props.value[this.props.attr].isSelected.includes("Charge") ? this.props.chargeMoveList : this.props.quickMoveList}
                        attr={this.props.attr}
                        category={this.props.value[this.props.attr].isSelected}
                        onChange={this.props.onChange}
                    />}
                />}


                {(this.props.pokemonTable[this.props.value[this.props.attr].Name]) &&
                    <div className="col-12 px-0  my-1">
                        <CpAndTyping
                            class="d-flex dont90 justify-content-center align-items-center"

                            Lvl={this.props.value[this.props.attr].Lvl}
                            Atk={this.props.value[this.props.attr].Atk}
                            Def={this.props.value[this.props.attr].Def}
                            Sta={this.props.value[this.props.attr].Sta}

                            pokemonTable={this.props.pokemonTable}
                            name={this.props.value[this.props.attr].Name}
                            tier={this.props.value[this.props.attr].Tier}
                            isBoss={this.props.attr === "bossObj"}
                        />
                    </div>}


                <div className="col-12 px-0 my-1">
                    <div className="row mx-0 justify-content-between align-items-center">
                        {this.props.pokList &&
                            <div className="col-6 px-0 pr-1">
                                <SearchableSelect
                                    value={this.props.value[this.props.attr].Name}
                                    list={this.props.pokList}
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                />
                            </div>}
                        {this.props.attr !== "bossObj" &&
                            <div className="col-6 px-0 pl-1">
                                <Stats
                                    class="font95 input-group input-group-sm"

                                    Lvl={this.props.value[this.props.attr].Lvl}
                                    Atk={this.props.value[this.props.attr].Atk}
                                    Def={this.props.value[this.props.attr].Def}
                                    Sta={this.props.value[this.props.attr].Sta}
                                    attr={this.props.attr}
                                    onChange={this.props.onChange}
                                />
                            </div>}

                        {this.props.attr === "bossObj" &&
                            <div className="col-6 px-0 pl-1">
                                <SelectGroup
                                    class="input-group input-group-sm"
                                    name="Tier"
                                    value={this.props.value[this.props.attr].Tier}
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





                <div className="col-6 px-0 pr-1  my-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="QuickMove"
                        value={this.props.value[this.props.attr].QuickMove && this.props.moveTable[this.props.value[this.props.attr].QuickMove] !== undefined &&
                            this.props.value[this.props.attr].QuickMove}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={this.props.value[this.props.attr].quickMovePool}

                        labelWidth="88px"
                        label={strings.title.quickMove}
                        labelStyle={(this.props.moveTable[this.props.value[this.props.attr].QuickMove] !== undefined) ?
                            `typeColorC${this.props.moveTable[this.props.value[this.props.attr].QuickMove].MoveType} text` : ""}

                        place={"top"}
                        for={"QuickMove" + this.props.attr}
                        tip={<>{strings.tips.quick}<br />
                            {this.props.value[this.props.attr].QuickMove && this.props.moveTable[this.props.value[this.props.attr].QuickMove] !== undefined && <>
                                {strings.move.damage + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Damage)}<br />
                                {strings.move.energy + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Energy)}<br />
                                {"Cooldown: " + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Cooldown / 1000)}<br />
                                {"DPS: " + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Damage /
                                    (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                                {"EPS: " + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Energy /
                                    (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                            </>}</>}
                        tipClass="infoTip"
                    />
                </div>
                <div className="col-6 px-0 pl-1  my-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="ChargeMove"
                        value={(this.props.value[this.props.attr].ChargeMove && this.props.value[this.props.attr].ChargeMove !== "Select..."
                            && this.props.moveTable[this.props.value[this.props.attr].ChargeMove] !== undefined) ? this.props.value[this.props.attr].ChargeMove : ""}

                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={this.props.value[this.props.attr].chargeMovePool}

                        labelWidth="88px"
                        label={strings.title.chargeMove}
                        labelStyle={(this.props.moveTable[this.props.value[this.props.attr].ChargeMove] !== undefined) ?
                            `typeColorC${this.props.moveTable[this.props.value[this.props.attr].ChargeMove].MoveType} text` : ""}

                        place={"top"}
                        for={"ChargeMove" + this.props.attr}

                        tip={<>{strings.tips.charge}<br />
                            {(this.props.value[this.props.attr].ChargeMove && this.props.value[this.props.attr].ChargeMove !== "Select...") &&
                                this.props.moveTable[this.props.value[this.props.attr].ChargeMove] !== undefined &&
                                <>
                                    {strings.move.damage + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Damage)}<br />
                                    {strings.move.energy + (-this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Energy)}<br />
                                    {"Cooldown: " + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Cooldown / 1000)}<br />
                                    {"DPS: " + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Damage / (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Cooldown / 1000)).toFixed(2)}<br />
                                    {"DPS*DPE: " + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Damage /
                                        (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Cooldown / 1000) *
                                        this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Damage /
                                        -this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Energy).toFixed(2)}<br />
                                </>}</>}
                        tipClass="infoTip"
                    />
                </div>
            </div>
        )
    }

}

export default PvePokemon