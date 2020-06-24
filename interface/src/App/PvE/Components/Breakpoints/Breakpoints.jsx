import React from "react";
import LocalizedStrings from 'react-localization';

import SelectGroup from "../../../PvP/components/SelectGroup/SelectGroup";
import { pveLocale } from "../../../../locale/pveLocale"
import { getCookie, tierMult, pveDamage, returnEffAtk, getPveMultiplier } from '../../../../js/indexFunctions'
import BreakpointsList from "./BreakpointsList"
import DamageCounter from "./DamageCounter"


let pveStrings = new LocalizedStrings(pveLocale);

class Breakpoints extends React.PureComponent {
    constructor(props) {
        super(props);
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            attackerObj: {
                Atk: this.props.snapshot.attackerObj.Atk,
            },
            pveObj: {
                FriendshipStage: this.props.snapshot.pveObj.FriendshipStage,
                Weather: this.props.snapshot.pveObj.Weather,
            },
            effDef: this.effectiveDef(),

            baseQuick: this.returnDmage("QuickMove"),
            baseCharge: this.returnDmage("ChargeMove"),
            dQuick: this.returnDmage("QuickMove"),
            dCharge: this.returnDmage("ChargeMove"),


            AttackIV: [
                <option value="0" key="0">0</option>,
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
            ],
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
            FriendshipStage: [
                <option value="0" key="0">{pveStrings.friendList.no}</option>,
                <option value="1" key="1">{pveStrings.friendList.good + " (3%)"}</option>,
                <option value="2" key="2">{pveStrings.friendList.great + " (5%)"}</option>,
                <option value="3" key="3">{pveStrings.friendList.ultra + " (7%)"}</option>,
                <option value="4" key="4">{pveStrings.friendList.best + " (10%)"}</option>,
                <option value="5" key="5">{pveStrings.friendList.good + " (6%)"}</option>,
                <option value="6" key="6">{pveStrings.friendList.great + " (12%)"}</option>,
                <option value="7" key="7">{pveStrings.friendList.ultra + " (18%)"}</option>,
                <option value="8" key="8">{pveStrings.friendList.best + " (25%)"}</option>,
            ],
        };
        this.onChange = this.onChange.bind(this);
    }

    effectiveDef() {
        return (15 + this.props.pokemonTable[this.props.snapshot.bossObj.Name].Def) * tierMult[this.props.snapshot.bossObj.Tier]
    }

    returnDmage(type) {
        let multiplier = getPveMultiplier(this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Type,
            this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type,
            this.props.moveTable[this.props.snapshot.attackerObj[type]].MoveType,
            this.props.snapshot.pveObj.Weather,
            this.props.snapshot.pveObj.FriendshipStage)


        return pveDamage(this.props.moveTable[this.props.snapshot.attackerObj[type]].Damage,
            returnEffAtk(this.props.snapshot.attackerObj.Atk,
                this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Atk,
                this.props.snapshot.attackerObj.Lvl,
                this.props.snapshot.attackerObj.IsShadow),
            this.effectiveDef(),
            multiplier)
    }

    onChange(event) {

        let role = event.target.getAttribute('attr')
        let friendsh = this.state.pveObj.FriendshipStage
        let weather = this.state.pveObj.Weather
        let atkIV = this.state.attackerObj.Atk

        switch (event.target.name) {
            case "FriendshipStage":
                friendsh = event.target.value
                break
            case "Weather":
                weather = event.target.value
                break
            case "Atk":
                atkIV = event.target.value
                break
            default:
        }

        let qMult = getPveMultiplier(this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Type,
            this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type,
            this.props.moveTable[this.props.snapshot.attackerObj.QuickMove].MoveType,
            weather,
            friendsh)

        let chMult = getPveMultiplier(this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Type,
            this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type,
            this.props.moveTable[this.props.snapshot.attackerObj.ChargeMove].MoveType,
            weather,
            friendsh)

        //!! level
        let effAtk = returnEffAtk(atkIV,
            this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Atk,
            this.props.snapshot.attackerObj.Lvl,
            this.props.snapshot.attackerObj.IsShadow)


        let dQuick = this.state.dQuick
        let dCharge = this.state.dCharge
        let baseQ = this.state.baseQuick
        let baseCh = this.state.baseCharge

        switch (event.target.name) {
            case "Lvl":
                break
            default:
                baseQ = pveDamage(this.props.moveTable[this.props.snapshot.attackerObj.QuickMove].Damage,
                    effAtk, this.state.effDef, qMult)
                baseCh = pveDamage(this.props.moveTable[this.props.snapshot.attackerObj.ChargeMove].Damage,
                    effAtk, this.state.effDef, chMult)
                dQuick = baseQ
                dCharge = baseCh
        }



        this.setState({
            dQuick: dQuick,
            dCharge: dCharge,
            baseQuick: baseQ,
            baseCharge: baseCh,

            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value
            },
        });
    }


    render() {
        return (
            <div className="row  justify-content-center m-0 p-0">
                <SelectGroup
                    name="Atk"
                    value={this.state.attackerObj.Atk}
                    attr={"attackerObj"}
                    onChange={this.onChange}
                    options={this.state.AttackIV}
                    label={pveStrings.atkiv}

                    for={""}
                />
                <SelectGroup
                    name="FriendshipStage"
                    value={this.state.pveObj.FriendshipStage}
                    attr={"pveObj"}
                    onChange={this.onChange}
                    options={this.state.FriendshipStage}
                    label={pveStrings.friend}

                    for={""}
                />
                <SelectGroup
                    name="Weather"
                    value={this.state.pveObj.Weather}
                    attr={"pveObj"}
                    onChange={this.onChange}
                    options={this.state.Weather}
                    label={pveStrings.weather}

                    for={""}
                />
                <DamageCounter
                    dQuick={this.state.dQuick}
                    dCharge={this.state.dCharge}

                    baseQuick={this.state.baseQuick}
                    baseCharge={this.state.baseCharge}

                    quickName={this.props.snapshot.attackerObj.QuickMove}
                    chargeName={this.props.snapshot.attackerObj.ChargeMove}
                />


                <BreakpointsList
                    move={this.props.moveTable[this.props.snapshot.attackerObj.QuickMove]}
                    attacker={this.props.pokemonTable[this.props.snapshot.attackerObj.Name]}
                    boss={this.props.pokemonTable[this.props.snapshot.bossObj.Name]}

                    IsShadow={this.props.snapshot.attackerObj.IsShadow}
                    Lvl={this.props.snapshot.attackerObj.Lvl}

                    effDef={this.state.effDef}
                    Atk={this.state.attackerObj.Atk}
                    friend={this.state.pveObj.FriendshipStage}
                    weather={this.state.pveObj.Weather}
                />
            </div>
        )
    }

}


export default Breakpoints;