import React from "react";
import Stats from "../../PvP/components/Stats/Stats";
import SelectGroup from "../../PvP/components/SelectGroup/SelectGroup";
import PvePokemon from "./PvePokemon"

import LocalizedStrings from "react-localization";
import { locale } from "../../../locale/locale"
import { pveLocale } from "../../../locale/pveLocale"
import { getCookie } from "../../../js/getCookie"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale);

class SimulatorPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            Weather: [
                <option value="0" key="0">{pveStrings.weatherList[0]}</option>,
                <option value="1" key="1">{pveStrings.weatherList[1]}</option>,
                <option value="2" key="2">{pveStrings.weatherList[2]}</option>,
                <option value="3" key="3">{pveStrings.weatherList[3]}</option>,
                <option value="4" key="4">{pveStrings.weatherList[4]}</option>,
                <option value="5" key="5">{pveStrings.weatherList[5]}</option>,
                <option value="6" key="6">{pveStrings.weatherList[6]}</option>,
                <option value="7" key="7">{pveStrings.weatherList[7]}</option>,
            ],
            DodgeStrategy: [
                <option value="0" key="0">{pveStrings.dodgeList}</option>,
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
                <option value="6" key="6">{"6 (1 " + pveStrings.party + ")"}</option>,
                <option value="12" key="12">{"12 (2 " + pveStrings.parties + ")"}</option>,
                <option value="18" key="18">{"18 (3 " + pveStrings.parties + ")"}</option>,
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
                <option value="0" key="0">{pveStrings.friendList.no}</option>,
                <option value="1" key="1">{pveStrings.friendList.good + " (3%)"}</option>,
                <option value="2" key="2">{pveStrings.friendList.great + " (5%)"}</option>,
                <option value="3" key="3">{pveStrings.friendList.ultra + " (7%)"}</option>,
                <option value="4" key="4">{pveStrings.friendList.best + " (10%)"}</option>,
                <option value="5" key="5">{pveStrings.friendList.good + " (6%)" + pveStrings.friendList.ev}</option>,
                <option value="6" key="6">{pveStrings.friendList.great + " (12%)" + pveStrings.friendList.ev}</option>,
                <option value="7" key="7">{pveStrings.friendList.ultra + " (18%)" + pveStrings.friendList.ev}</option>,
                <option value="8" key="8">{pveStrings.friendList.best + " (25%)" + pveStrings.friendList.ev}</option>,
            ],
            tierTip: [
                <div key="tiertip">
                    HP босса:<br />
                    {pveStrings.tierlist + " 1 - 600 HP"}<br />
                    {pveStrings.tierlist + " 2 - 1800 HP"}<br />
                    {pveStrings.tierlist + " 3 - 3600 HP"}<br />
                    {pveStrings.tierlist + " 4 - 9000 HP"}<br />
                    {pveStrings.tierlist + " 5 - 15000 HP"}<br />
                    {pveStrings.tierlist + " 5.5 - 22500 HP"}<br />
                </div>
            ]
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="order-1 order-sm-1 col-6 col-sm-4 text-center px-1"><h5 className="fBolder">{pveStrings.attacker}</h5></div>
                <div className="order-1 order-sm-1 col-6 col-sm-4 text-center px-1"><h5 className="fBolder">{pveStrings.raid}</h5></div>
                <div className="order-1 order-sm-1 col-6 col-sm-4 text-center px-1"><h5 className="fBolder">{pveStrings.boss}</h5></div>
                <div className="order-1 order-sm-1 col-6 col-sm-4 text-center px-1">
                    <PvePokemon
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
                        tipClass="infoTip"
                    />
                </div>
                <div className="order-3 order-sm-2 col-12 col-sm-4 text-center px-1">
                    <div className="row m-0">
                        <div className="col-6 col-sm-12 p-0 pr-1 pr-sm-0">
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

                                tip={pveStrings.playernumbTip}
                                tipClass="infoTip"
                            />
                            <SelectGroup
                                name="PartySize"
                                value={this.props.value.pveObj.PartySize}
                                attr={"pveObj"}
                                onChange={this.props.onChange}
                                options={this.state.PartySize}
                                label={pveStrings.partysize}

                                place={"top"}
                                for={"partySizeTips"}
                                tip={pveStrings.sizetip}
                                tipClass="infoTip"
                            />
                            <SelectGroup
                                name="Weather"
                                value={this.props.value.pveObj.Weather}
                                attr={"pveObj"}
                                onChange={this.props.onChange}
                                options={this.state.Weather}
                                label={pveStrings.weather}

                                for={""}
                            />
                        </div >
                        <div className="col-6 col-sm-12 p-0 pl-1 pl-sm-0">
                            <SelectGroup
                                name="DodgeStrategy"
                                value={this.props.value.pveObj.DodgeStrategy}
                                attr={"pveObj"}
                                onChange={this.props.onChange}
                                options={this.state.DodgeStrategy}
                                label={pveStrings.dodge}


                                place={"top"}
                                for={"pveDodgeStrategy"}

                                tip={pveStrings.dodgetip}
                                tipClass="infoTip"
                            />
                            <SelectGroup
                                name="FriendshipStage"
                                value={this.props.value.pveObj.FriendshipStage}
                                attr={"pveObj"}
                                onChange={this.props.onChange}
                                options={this.state.FriendshipStage}
                                label={pveStrings.friend}

                                for={""}
                            />
                        </div >
                    </div>
                </div>

                <div className="order-2 order-sm-3 col-6 col-sm-4 text-center px-1">
                    <PvePokemon
                        attr="bossObj"

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

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
                        for={"bossTier"}

                        tip={this.state.tierTip}
                        tipClass="infoTip"
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

                        tip={pveStrings.aggresivetip}
                        tipClass="infoTip"
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


                            place={((this.props.attr === "attacker") ? "right" : "left")}
                            for={"shadow" + this.props.attr}

                            tip={strings.tips.shadow}
                            tipClass="infoTip"
                        />
                    </>}
            </div>
        )
    }

}

export default SimulatorPanel