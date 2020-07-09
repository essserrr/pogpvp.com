import React from "react";
import SearchableSelect from "../../PvP/components/SearchableSelect/SearchableSelect";
import SelectGroup from "../../PvP/components/SelectGroup/SelectGroup";
import MagicBox from "../../PvP/components/MagicBox/MagicBox"
import CpAndTyping from "../../PvP/components/CpAndTypes/CpAndTypes"


import LocalizedStrings from "react-localization";
import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

class PvePokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
        };
    }
    render() {
        return (

            <>
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


                <p5 className="fBolder">{this.props.title}</p5>
                {this.props.pokList && <SearchableSelect
                    value={this.props.value[this.props.attr].Name}
                    list={this.props.pokList}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                />}

                {(this.props.pokemonTable[this.props.value[this.props.attr].Name]) && <CpAndTyping
                    Lvl={this.props.value[this.props.attr].Lvl}
                    Atk={this.props.value[this.props.attr].Atk}
                    Def={this.props.value[this.props.attr].Def}
                    Sta={this.props.value[this.props.attr].Sta}

                    pokemonTable={this.props.pokemonTable}
                    name={this.props.value[this.props.attr].Name}
                    tier={this.props.value[this.props.attr].Tier}
                    isBoss={this.props.attr === "bossObj"}
                />}

                <SelectGroup
                    name="QuickMove"
                    value={this.props.value[this.props.attr].QuickMove}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                    options={this.props.value[this.props.attr].quickMovePool}
                    label={strings.title.quickMove}
                    labelStyle={(this.props.moveTable[this.props.value[this.props.attr].QuickMove] !== undefined) ?
                        this.props.moveTable[this.props.value[this.props.attr].QuickMove].MoveType + " text" : ""}

                    place={"top"}
                    for={"QuickMove" + this.props.attr}
                    tip={<>{strings.tips.quick}<br />
                        {this.props.value[this.props.attr].QuickMove && <>
                            {strings.move.damage + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Damage)}<br />
                            {strings.move.energy + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Energy)}<br />
                            {"Cooldown: " + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Cooldown / 1000)}<br />
                            {"DPS: " + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Damage /
                                (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                            {"EPS: " + (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Energy /
                                (this.props.moveTable[this.props.value[this.props.attr].QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                        </>}</>}
                    tipClass="logItems"
                />

                <SelectGroup
                    name="ChargeMove"
                    value={(this.props.value[this.props.attr].ChargeMove && this.props.value[this.props.attr].ChargeMove !== "Select...") ?
                        this.props.value[this.props.attr].ChargeMove : ""}

                    attr={this.props.attr}
                    onChange={this.props.onChange}
                    options={this.props.value[this.props.attr].chargeMovePool}
                    label={strings.title.chargeMove}
                    labelStyle={(this.props.moveTable[this.props.value[this.props.attr].ChargeMove] !== undefined) ?
                        this.props.moveTable[this.props.value[this.props.attr].ChargeMove].MoveType + " text" : ""}

                    place={"top"}
                    for={"ChargeMove" + this.props.attr}

                    tip={<>{strings.tips.charge}<br />
                        {(this.props.value[this.props.attr].ChargeMove && this.props.value[this.props.attr].ChargeMove !== "Select...") && <>
                            {strings.move.damage + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].PvpDamage)}<br />
                            {strings.move.energy + (-this.props.moveTable[this.props.value[this.props.attr].ChargeMove].PvpEnergy)}<br />
                            {"Cooldown: " + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Cooldown / 1000)}<br />
                            {"DPS: " + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Damage / (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Cooldown / 1000)).toFixed(2)}<br />
                            {"DPS*DPE: " + (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Damage /
                                (this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Cooldown / 1000) *
                                this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Damage /
                                -this.props.moveTable[this.props.value[this.props.attr].ChargeMove].Energy).toFixed(2)}<br />
                        </>}</>}
                    tipClass="logItems"
                />

            </>
        )
    }

}

export default PvePokemon