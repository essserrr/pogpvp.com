import React from "react";
import Stats from "../../PvP/components/Stats/Stats";
import SearchableSelect from "../../PvP/components/SearchableSelect/SearchableSelect";
import SelectGroup from "../../PvP/components/SelectGroup/SelectGroup";
import CpAndTyping from "../../PvP/components/CpAndTypes/CpAndTypes"
import MagicBox from "../../PvP/components/MagicBox/MagicBox"


import LocalizedStrings from 'react-localization';
import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

class SimulatorPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            weather: [
                <option value="0" key="0">Extreme</option>,
                <option value="1" key="1">Sunny</option>,
                <option value="2" key="2">Rainy</option>,
                <option value="3" key="3">Partly cloudy</option>,
                <option value="4" key="4">Cloudy</option>,
                <option value="5" key="5">Windy</option>,
                <option value="6" key="6">Snowy</option>,
                <option value="7" key="7">Foggy</option>,
            ],
            dodgeStrategy: [
                <option value="0" key="0">No dodge</option>,
                <option value="1" key="1">25%</option>,
                <option value="2" key="2">50%</option>,
                <option value="3" key="3">75%</option>,
                <option value="4" key="4">100%</option>,
            ],
            partySize: [
                <option value="6" key="6">6</option>,
                <option value="12" key="12">12</option>,
                <option value="18" key="18">18</option>,
            ],
            playersNumber: [
                <option value="1" key="1">1</option>,
                <option value="2" key="2">2</option>,
                <option value="3" key="3">3</option>,
                <option value="4" key="4">4</option>,
                <option value="5" key="5">5</option>,
                <option value="6" key="6">6</option>,
                <option value="7" key="7">7</option>,
                <option value="8" key="8">8</option>,
                <option value="9" key="9">9</option>,
                <option value="10" key="10">10</option>,
                <option value="11" key="11">11</option>,
                <option value="12" key="12">12</option>,
                <option value="13" key="13">13</option>,
                <option value="14" key="14">14</option>,
                <option value="15" key="15">15</option>,
                <option value="16" key="16">16</option>,
                <option value="17" key="17">17</option>,
                <option value="18" key="18">18</option>,
                <option value="19" key="19">19</option>,
                <option value="20" key="20">20</option>,
            ],
            isAggresive: [
                <option value="false" key="Normal">Normal</option>,
                <option value="true" key="Aggresive">Aggresive</option>,
            ],
            typeList: [
                <option value="false" key="Normal">{strings.options.type.normal}</option>,
                <option value="true" key="Shadow">{strings.options.type.shadow}</option>,
            ],
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                {(this.props.showMenu) && <MagicBox
                    title={strings.title.selectMove}
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={<SearchableSelect
                        list={this.props.moveList}
                        attr={this.props.attr}
                        category={this.props.category}
                        onChange={this.props.onChange}
                    />}
                />}


                <div className="col-4 m-0 p-0">
                    Attacker (optional)
                    {this.props.pokList && <SearchableSelect
                        value={this.props.value.attackerObj.Name}
                        list={this.props.pokList}
                        attr={"attackerObj"}
                        onChange={this.props.onChange}
                    />}
                    <SelectGroup
                        name="QuickMove"
                        value={this.props.value.attackerObj.QuickMove}
                        attr={"attackerObj"}
                        onChange={this.props.onChange}
                        options={this.props.value.attackerObj.quickMovePool}
                        label={strings.title.quickMove}
                        labelStyle={(this.props.moveTable[this.props.value.attackerObj.QuickMove] !== undefined) ?
                            "color" + this.props.moveTable[this.props.value.attackerObj.QuickMove].MoveType + " text" : ""}

                        place={"top"}
                        for={this.props.value.attackerObj.QuickMove && "QuickMoveattackerObj"}
                        tip={this.props.value.attackerObj.QuickMove && <small>
                            {strings.move.damage + (this.props.moveTable[this.props.value.attackerObj.QuickMove].Damage)}<br />
                            {strings.move.energy + (this.props.moveTable[this.props.value.attackerObj.QuickMove].Energy)}<br />
                            {"Cooldown: " + (this.props.moveTable[this.props.value.attackerObj.QuickMove].Cooldown / 1000)}<br />
                            {"DPS: " + (this.props.moveTable[this.props.value.attackerObj.QuickMove].Damage / (this.props.moveTable[this.props.value.attackerObj.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                            {"EPS: " + (this.props.moveTable[this.props.value.attackerObj.QuickMove].Energy / (this.props.moveTable[this.props.value.attackerObj.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                        </small>}
                        tipClass='logItems'
                    />

                    <SelectGroup
                        name="ChargeMove"
                        value={(this.props.value.attackerObj.ChargeMove && this.props.value.attackerObj.ChargeMove !== "Select...") ?
                            this.props.value.attackerObj.ChargeMove : ""}

                        attr={"attackerObj"}
                        onChange={this.props.onChange}
                        options={this.props.value.attackerObj.chargeMovePool}
                        label={strings.title.chargeMove}
                        labelStyle={(this.props.moveTable[this.props.value.attackerObj.ChargeMove] !== undefined) ?
                            "color" + this.props.moveTable[this.props.value.attackerObj.ChargeMove].MoveType + " text" : ""}

                        place={"top"}
                        for={(this.props.value.attackerObj.ChargeMove && this.props.value.attackerObj.ChargeMove !== "Select...") && ("ChargeMove1attackerObj")}
                        tip={(this.props.value.attackerObj.ChargeMove && this.props.value.attackerObj.ChargeMove !== "Select...") && <small>
                            {strings.move.damage + (this.props.moveTable[this.props.value.attackerObj.ChargeMove].PvpDamage)}<br />
                            {strings.move.energy + (-this.props.moveTable[this.props.value.attackerObj.ChargeMove].PvpEnergy)}<br />
                            {"Cooldown: " + (this.props.moveTable[this.props.value.attackerObj.ChargeMove].Cooldown / 1000)}<br />
                            {"DPS: " + (this.props.moveTable[this.props.value.attackerObj.ChargeMove].Damage / (this.props.moveTable[this.props.value.attackerObj.ChargeMove].Cooldown / 1000)).toFixed(2)}<br />
                            {"DPS*DPE: " + (this.props.moveTable[this.props.value.attackerObj.ChargeMove].Damage / (this.props.moveTable[this.props.value.attackerObj.ChargeMove].Cooldown / 1000) * this.props.moveTable[this.props.value.attackerObj.ChargeMove].Damage / -this.props.moveTable[this.props.value.attackerObj.ChargeMove].Energy).toFixed(2)}<br />

                        </small>}
                        tipClass='logItems'
                    />
                </div>

                <div className="col-4 m-0 p-0">
                    Boss (required)
                    {this.props.pokList && <SearchableSelect
                        value={this.props.value.bossObj.Name}
                        list={this.props.pokList}
                        attr={"bossObj"}
                        onChange={this.props.onChange}
                    />}

                    <SelectGroup
                        name="QuickMove"
                        value={this.props.value.bossObj.QuickMove}
                        attr={"bossObj"}
                        onChange={this.props.onChange}
                        options={this.props.value.bossObj.quickMovePool}
                        label={strings.title.quickMove}
                        labelStyle={(this.props.moveTable[this.props.value.bossObj.QuickMove] !== undefined) ?
                            "color" + this.props.moveTable[this.props.value.bossObj.QuickMove].MoveType + " text" : ""}

                        place={"top"}
                        for={this.props.value.bossObj.QuickMove && "QuickMovebossObj"}
                        tip={this.props.value.bossObj.QuickMove && <small>
                            {strings.move.damage + (this.props.moveTable[this.props.value.bossObj.QuickMove].Damage)}<br />
                            {strings.move.energy + (this.props.moveTable[this.props.value.bossObj.QuickMove].Energy)}<br />
                            {"Cooldown: " + (this.props.moveTable[this.props.value.bossObj.QuickMove].Cooldown / 1000)}<br />
                            {"DPS: " + (this.props.moveTable[this.props.value.bossObj.QuickMove].Damage / (this.props.moveTable[this.props.value.bossObj.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                            {"EPS: " + (this.props.moveTable[this.props.value.bossObj.QuickMove].Energy / (this.props.moveTable[this.props.value.bossObj.QuickMove].Cooldown / 1000)).toFixed(2)}<br />
                        </small>}
                        tipClass='logItems'
                    />

                    <SelectGroup
                        name="ChargeMove"
                        value={(this.props.value.bossObj.ChargeMove && this.props.value.bossObj.ChargeMove !== "Select...") ?
                            this.props.value.bossObj.ChargeMove : ""}

                        attr={"bossObj"}
                        onChange={this.props.onChange}
                        options={this.props.value.bossObj.chargeMovePool}
                        label={strings.title.chargeMove}
                        labelStyle={(this.props.moveTable[this.props.value.bossObj.ChargeMove] !== undefined) ?
                            "color" + this.props.moveTable[this.props.value.bossObj.ChargeMove].MoveType + " text" : ""}

                        place={"top"}
                        for={(this.props.value.bossObj.ChargeMove && this.props.value.bossObj.ChargeMove !== "Select...") && ("ChargeMove1bossObj")}
                        tip={(this.props.value.bossObj.ChargeMove && this.props.value.bossObj.ChargeMove !== "Select...") && <small>
                            {strings.move.damage + (this.props.moveTable[this.props.value.bossObj.ChargeMove].PvpDamage)}<br />
                            {strings.move.energy + (-this.props.moveTable[this.props.value.bossObj.ChargeMove].PvpEnergy)}<br />
                            {"Cooldown: " + (this.props.moveTable[this.props.value.bossObj.ChargeMove].Cooldown / 1000)}<br />
                            {"DPS: " + (this.props.moveTable[this.props.value.bossObj.ChargeMove].Damage / (this.props.moveTable[this.props.value.bossObj.ChargeMove].Cooldown / 1000)).toFixed(2)}<br />
                            {"DPS*DPE: " + (this.props.moveTable[this.props.value.bossObj.ChargeMove].Damage / (this.props.moveTable[this.props.value.bossObj.ChargeMove].Cooldown / 1000) * this.props.moveTable[this.props.value.bossObj.ChargeMove].Damage / -this.props.moveTable[this.props.value.bossObj.ChargeMove].Energy).toFixed(2)}<br />

                        </small>}
                        tipClass='logItems'
                    />
                </div>




                {(this.props.pokemonTable[this.props.value.name] && this.props.value.name) &&
                    <>
                        <CpAndTyping
                            Lvl={this.props.value.Lvl}
                            Atk={this.props.value.Atk}
                            Def={this.props.value.Def}
                            Sta={this.props.value.Sta}
                            pokemonTable={this.props.pokemonTable}
                            name={this.props.value.name}
                        />

                        <Stats
                            Lvl={this.props.value.Lvl}
                            Atk={this.props.value.Atk}
                            Def={this.props.value.Def}
                            Sta={this.props.value.Sta}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                        />





                        <SelectGroup
                            name="IsShadow"
                            value={this.props.value.IsShadow}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                            options={this.state.typeList}
                            label={strings.title.type}


                            place={((this.props.attr === "attacker") ? 'right' : 'left')}
                            for={"shadow" + this.props.attr}

                            tip={strings.tips.shadow}
                            tipClass='strategyTips'
                        />



                    </>}
            </div>
        )
    }

}

export default SimulatorPanel