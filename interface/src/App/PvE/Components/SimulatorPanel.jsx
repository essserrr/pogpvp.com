import React from "react";
import Stats from "../../PvP/components/Stats/Stats";
import SelectGroup from "../../PvP/components/SelectGroup/SelectGroup";
import PvePokemon from "./PvePokemon"

import LocalizedStrings from 'react-localization';
import { locale } from "../../../locale/locale"
import { pveLocale } from "../../../locale/pveLocale"
import { getCookie } from "../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale);

class SimulatorPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            Weather: [
                <option value="0" key="0">Extreme</option>,
                <option value="1" key="1">Sunny</option>,
                <option value="2" key="2">Rainy</option>,
                <option value="3" key="3">Partly cloudy</option>,
                <option value="4" key="4">Cloudy</option>,
                <option value="5" key="5">Windy</option>,
                <option value="6" key="6">Snowy</option>,
                <option value="7" key="7">Foggy</option>,
            ],
            DodgeStrategy: [
                <option value="0" key="0">No dodge</option>,
                <option value="1" key="1">25%</option>,
                <option value="2" key="2">50%</option>,
                <option value="3" key="3">75%</option>,
                <option value="4" key="4">100%</option>,
            ],
            Tier: [
                <option value="0" key="0">{pveStrings.tierlist + " 1"}</option>,
                <option value="1" key="1">{pveStrings.tierlist + " 2"}</option>,
                <option value="2" key="2">{pveStrings.tierlist + " 3"}</option>,
                <option value="3" key="3">{pveStrings.tierlist + " 4"}</option>,
                <option value="4" key="4">{pveStrings.tierlist + " 5"}</option>,
                <option value="5" key="6">{pveStrings.tierlist + " 5.5"}</option>,
            ],
            PartySize: [
                <option value="6" key="6">6</option>,
                <option value="12" key="12">12</option>,
                <option value="18" key="18">18</option>,
            ],
            PlayersNumber: [
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
            IsAggresive: [
                <option value="false" key="Normal">{pveStrings.aggrList.norm}</option>,
                <option value="true" key="Aggresive">{pveStrings.aggrList.aggr}</option>,
            ],
            IsShadow: [
                <option value="false" key="Normal">{strings.options.type.normal}</option>,
                <option value="true" key="Shadow">{strings.options.type.shadow}</option>,
            ],
            0: 1.0,
            FriendshipStage: [
                <option value="0" key="0">No bonus (0%)</option>,
                <option value="1" key="1">Good (3%)</option>,
                <option value="2" key="2">Great (5%)</option>,
                <option value="3" key="3">Ultra (7%)</option>,
                <option value="4" key="4">Best (10%)</option>,
                <option value="5" key="5">Good (6%)</option>,
                <option value="6" key="6">Great (12%)</option>,
                <option value="7" key="7">Ultra (18%)</option>,
                <option value="8" key="8">Best (25%)</option>,
            ],
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="col-4 m-0 p-0 text-center px-1">
                    <PvePokemon
                        title="Attacker (optional)"
                        attr="attackerObj"

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

                        value={this.props.value}
                        onChange={this.props.onChange}

                        onClick={this.props.onClick}
                    />
                    <Stats
                        class="font95 input-group input-group-sm mt-2 mb-2"

                        Lvl={this.props.value.attackerObj.Lvl}
                        Atk={this.props.value.attackerObj.Atk}
                        Def={this.props.value.attackerObj.Def}
                        Sta={this.props.value.attackerObj.Sta}
                        attr={"attackerObj"}
                        onChange={this.props.onChange}
                    />
                    <SelectGroup
                        name="IsShadow"
                        value={this.props.value.attackerObj.IsShadow}
                        attr={"attackerObj"}
                        onChange={this.props.onChange}
                        options={this.state.IsShadow}
                        label={strings.title.type}

                        place={"top"}
                        for={"attackerIsShadow"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                </div>
                <div className="col-4 m-0 p-0 text-center px-1">
                    Raid Settings
                    <SelectGroup
                        class="input-group input-group-sm mt-2"
                        name="PlayersNumber"
                        value={this.props.value.pveObj.PlayersNumber}
                        attr={"pveObj"}
                        onChange={this.props.onChange}
                        options={this.state.PlayersNumber}
                        label={pveStrings.playernumb}


                        place={"top"}
                        for={"pvePlayersNumber"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                    <SelectGroup
                        name="PartySize"
                        value={this.props.value.pveObj.PartySize}
                        attr={"pveObj"}
                        onChange={this.props.onChange}
                        options={this.state.PartySize}
                        label={pveStrings.partysize}


                        place={"top"}
                        for={"pvePartySize"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                    <SelectGroup
                        name="Weather"
                        value={this.props.value.pveObj.Weather}
                        attr={"pveObj"}
                        onChange={this.props.onChange}
                        options={this.state.Weather}
                        label={pveStrings.weather}


                        place={"top"}
                        for={"pveWeather"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                    <SelectGroup
                        name="DodgeStrategy"
                        value={this.props.value.pveObj.DodgeStrategy}
                        attr={"pveObj"}
                        onChange={this.props.onChange}
                        options={this.state.DodgeStrategy}
                        label={pveStrings.dodge}


                        place={"top"}
                        for={"pveDodgeStrategy"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                    <SelectGroup
                        name="FriendshipStage"
                        value={this.props.value.pveObj.FriendshipStage}
                        attr={"pveObj"}
                        onChange={this.props.onChange}
                        options={this.state.FriendshipStage}
                        label={pveStrings.friend}


                        place={"top"}
                        for={"pveFriendshipStage"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                </div>

                <div className="col-4 m-0 p-0 text-center px-1">
                    <PvePokemon
                        title="Boss (required)"
                        attr="bossObj"

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.chargeMoveList}

                        value={this.props.value}
                        onChange={this.props.onChange}
                        onClick={this.props.onClick}
                    />
                    <SelectGroup
                        name="Tier"
                        value={this.props.value.bossObj.Tier}
                        attr={"bossObj"}
                        onChange={this.props.onChange}
                        options={this.state.Tier}
                        label={pveStrings.tier}


                        place={"top"}
                        for={"Tier"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                    <SelectGroup
                        name="IsAggresive"
                        value={this.props.value.pveObj.IsAggresive}
                        attr={"pveObj"}
                        onChange={this.props.onChange}
                        options={this.state.IsAggresive}
                        label={pveStrings.aggreasive}


                        place={"top"}
                        for={"bossIsAggresive"}

                        tip={strings.tips.shadow}
                        tipClass='strategyTips'
                    />
                </div>




                {(this.props.pokemonTable[this.props.value.name] && this.props.value.name) &&
                    <>


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
                            options={this.state.IsShadow}
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