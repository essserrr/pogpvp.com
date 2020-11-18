import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Input from "App/Components/Input/Input";
import { candyCost, dustCost } from "./powerupCost";
import Counter from "./Counter/Counter";
import BreakpointsList from "./BreakpointsList";

import { calculateDamage, returnEffAtk } from "js/indexFunctions";
import { getPveMultiplier } from "js/Damage/getPveMultiplier";
import { tierMult } from "js/bases/tierMult";
import { getCookie } from "js/getCookie";
import { ReactComponent as Dust } from "icons/stardust.svg";
import { ReactComponent as Candy } from "icons/candy.svg";

import { settings } from "locale/Pve/Settings/Settings";
import { breakoints } from "locale/Pve/Breakpoints/Breakpoints";

let pveStrings = new LocalizedStrings(settings);
let breakointStrings = new LocalizedStrings(breakoints);

class Breakpoints extends React.PureComponent {
    constructor(props) {
        super(props);
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        breakointStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        this.state = {
            attackerObj: {
                Lvl: props.snapshot.attackerObj.Lvl,
                Atk: props.snapshot.attackerObj.Atk,
            },
            pveObj: {
                FriendshipStage: props.snapshot.pveObj.FriendshipStage,
                Weather: props.snapshot.pveObj.Weather,
            },
            effDef: this.effectiveDef(),

            baseQuick: this.returnDamage("QuickMove"),
            baseCharge: this.returnDamage("ChargeMove"),
            dQuick: this.returnDamage("QuickMove"),
            dCharge: this.returnDamage("ChargeMove"),
        };
        this.onChange = this.onChange.bind(this);
        this.onPlusMinus = this.onPlusMinus.bind(this);
    }

    effectiveDef() {
        return (15 + this.props.pokemonTable[this.props.snapshot.bossObj.Name].Def) * tierMult[this.props.snapshot.bossObj.Tier]
    }

    returnDamage(type) {
        let multiplier = getPveMultiplier(this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Type,
            this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type,
            this.props.moveTable[this.props.snapshot.attackerObj[type]].MoveType,
            this.props.snapshot.pveObj.Weather,
            this.props.snapshot.pveObj.FriendshipStage)


        return calculateDamage(this.props.moveTable[this.props.snapshot.attackerObj[type]].Damage,
            returnEffAtk(this.props.snapshot.attackerObj.Atk,
                this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Atk,
                this.props.snapshot.attackerObj.Lvl,
                this.props.snapshot.attackerObj.IsShadow),
            this.effectiveDef(),
            multiplier)
    }

    onChange(event, attributes, eventItem) {
        const role = attributes.attr
        const name = attributes.name
        const value = event.target.name === undefined ? eventItem : event.target.value;

        let friendsh = this.state.pveObj.FriendshipStage
        let weather = this.state.pveObj.Weather
        let atkIV = this.state.attackerObj.Atk
        let lvl = this.state.attackerObj.Lvl

        switch (name) {
            case "FriendshipStage":
                friendsh = value
                lvl = this.props.snapshot.attackerObj.Lvl
                break
            case "Weather":
                weather = value
                lvl = this.props.snapshot.attackerObj.Lvl
                break
            case "Atk":
                atkIV = value
                lvl = this.props.snapshot.attackerObj.Lvl
                break
            default:
                lvl = value
        }

        const attacker = this.props.pokemonTable[this.props.snapshot.attackerObj.Name];
        const quickMove = this.props.moveTable[this.props.snapshot.attackerObj.QuickMove];
        const chargeMove = this.props.moveTable[this.props.snapshot.attackerObj.ChargeMove];
        const boss = this.props.pokemonTable[this.props.snapshot.bossObj.Name];

        const qMult = getPveMultiplier(attacker.Type, boss.Type, quickMove.MoveType, weather, friendsh)
        const chMult = getPveMultiplier(attacker.Type, boss.Type, chargeMove.MoveType, weather, friendsh)

        let effAtk = returnEffAtk(atkIV, attacker.Atk, lvl, this.props.snapshot.attackerObj.IsShadow)


        let dQuick = this.state.dQuick
        let dCharge = this.state.dCharge
        let baseQ = this.state.baseQuick
        let baseCh = this.state.baseCharge


        switch (name) {
            case "Lvl":
                dQuick = calculateDamage(quickMove.Damage, effAtk, this.state.effDef, qMult)
                dCharge = calculateDamage(chargeMove.Damage, effAtk, this.state.effDef, chMult)
                break
            default:
                baseQ = calculateDamage(quickMove.Damage, effAtk, this.state.effDef, qMult)
                baseCh = calculateDamage(chargeMove.Damage, effAtk, this.state.effDef, chMult)

                effAtk = returnEffAtk(atkIV, attacker.Atk, this.state.attackerObj.Lvl, this.props.snapshot.attackerObj.IsShadow)

                dQuick = calculateDamage(quickMove.Damage, effAtk, this.state.effDef, qMult)
                dCharge = calculateDamage(chargeMove.Damage, effAtk, this.state.effDef, chMult)
        }


        this.setState({
            dQuick: dQuick,
            dCharge: dCharge,
            baseQuick: baseQ,
            baseCharge: baseCh,

            [role]: {
                ...this.state[role],
                [name]: value,
            },
        });
    }

    onPlusMinus(event, attributes) {
        let lvl = Number(this.state.attackerObj.Lvl)
        switch (attributes.name) {
            case "plus":
                lvl += 0.5
                if (lvl > 45) {
                    return
                }
                break
            default:
                lvl -= 0.5
                if (lvl < this.props.snapshot.attackerObj.Lvl) {
                    return
                }
        }

        let qMult = getPveMultiplier(this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Type,
            this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type,
            this.props.moveTable[this.props.snapshot.attackerObj.QuickMove].MoveType,
            this.state.pveObj.Weather,
            this.state.pveObj.FriendshipStage)

        let chMult = getPveMultiplier(this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Type,
            this.props.pokemonTable[this.props.snapshot.bossObj.Name].Type,
            this.props.moveTable[this.props.snapshot.attackerObj.ChargeMove].MoveType,
            this.state.pveObj.Weather,
            this.state.pveObj.FriendshipStage)

        let effAtk = returnEffAtk(this.state.attackerObj.Atk,
            this.props.pokemonTable[this.props.snapshot.attackerObj.Name].Atk,
            lvl,
            this.props.snapshot.attackerObj.IsShadow)


        let dQuick = calculateDamage(this.props.moveTable[this.props.snapshot.attackerObj.QuickMove].Damage,
            effAtk, this.state.effDef, qMult)
        let dCharge = calculateDamage(this.props.moveTable[this.props.snapshot.attackerObj.ChargeMove].Damage,
            effAtk, this.state.effDef, chMult)


        this.setState({
            dQuick: dQuick,
            dCharge: dCharge,

            attackerObj: {
                ...this.state.attackerObj,
                Lvl: lvl
            },
        });
    }


    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Input select name="Atk" attr="attackerObj" value={this.state.attackerObj.Atk} label={breakointStrings.atkiv} onChange={this.onChange}>
                        <MenuItem value="0">0</MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="6">6</MenuItem>
                        <MenuItem value="7">7</MenuItem>
                        <MenuItem value="8">8</MenuItem>
                        <MenuItem value="9">9</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="11">11</MenuItem>
                        <MenuItem value="12">12</MenuItem>
                        <MenuItem value="13">13</MenuItem>
                        <MenuItem value="14">14</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                    </Input>
                </Grid>

                <Grid item xs={12}>
                    <Input select name="FriendshipStage" attr="pveObj" value={this.state.pveObj.FriendshipStage} label={pveStrings.friend} onChange={this.onChange}>
                        <MenuItem value="0">{pveStrings.friendList.no}</MenuItem>
                        <MenuItem value="1">{pveStrings.friendList.good + " (3%)"}</MenuItem>
                        <MenuItem value="2">{pveStrings.friendList.great + " (5%)"}</MenuItem>
                        <MenuItem value="3">{pveStrings.friendList.ultra + " (7%)"}</MenuItem>
                        <MenuItem value="4">{pveStrings.friendList.best + " (10%)"}</MenuItem>
                        <MenuItem value="5">{pveStrings.friendList.good + " (6%)"}</MenuItem>
                        <MenuItem value="6">{pveStrings.friendList.great + " (12%)"}</MenuItem>
                        <MenuItem value="7">{pveStrings.friendList.ultra + " (18%)"}</MenuItem>
                        <MenuItem value="8">{pveStrings.friendList.best + " (25%)"}</MenuItem>
                    </Input>
                </Grid>

                <Grid item xs={12}>
                    <Input select name="Weather" attr="pveObj" value={this.state.pveObj.Weather} label={pveStrings.weather} onChange={this.onChange}>
                        <MenuItem value="0">{pveStrings.weatherList[0]}</MenuItem>
                        <MenuItem value="1">{pveStrings.weatherList[1]}</MenuItem>
                        <MenuItem value="2">{pveStrings.weatherList[2]}</MenuItem>
                        <MenuItem value="3">{pveStrings.weatherList[3]}</MenuItem>
                        <MenuItem value="4">{pveStrings.weatherList[4]}</MenuItem>
                        <MenuItem value="5">{pveStrings.weatherList[5]}</MenuItem>
                        <MenuItem value="6">{pveStrings.weatherList[6]}</MenuItem>
                        <MenuItem value="7">{pveStrings.weatherList[7]}</MenuItem>
                    </Input>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body1" align="center">
                        <b>
                            {breakointStrings.damage}
                        </b>
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Counter
                        value={this.state.dQuick}
                        base={this.state.baseQuick}
                        name={this.props.snapshot.attackerObj.QuickMove}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Counter
                        value={this.state.dCharge}
                        base={this.state.baseCharge}
                        name={this.props.snapshot.attackerObj.ChargeMove}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Counter
                        value={dustCost[(Number(this.state.attackerObj.Lvl) / 0.5) - 1] - dustCost[(Number(this.props.snapshot.attackerObj.Lvl) / 0.5) - 1]}
                        base={999999999}
                        name={<Box mr={1}><Dust style={{ width: 24, height: 24 }} /></Box>}
                        colorForvalue={true}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Counter
                        value={candyCost[(Number(this.state.attackerObj.Lvl) / 0.5) - 1] - candyCost[(Number(this.props.snapshot.attackerObj.Lvl) / 0.5) - 1]}
                        base={999999999}
                        name={<Box mr={1}><Candy style={{ width: 24, height: 24 }} /></Box>}
                        colorForvalue={true}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Counter
                        value={Number(this.state.attackerObj.Lvl).toFixed(1)}
                        base={this.props.snapshot.attackerObj.Lvl}
                        name={breakointStrings.poklvl}

                        toFixed={true}
                        decimal={1}
                    />
                </Grid>

                <Grid item xs={12} container wrap="nowrap" alignItems="center">

                    <Box mr={1}>
                        <IconButton onClick={(event) => this.onPlusMinus(event, { name: "minus" })}
                            style={{ width: 24, height: 24, outline: "none" }}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>

                    <Slider
                        value={Number(this.state.attackerObj.Lvl)}
                        getAriaValueText={(value) => `Lvl: ${value}`}
                        valueLabelDisplay="auto"

                        onChange={(event, ...other) => this.onChange(event, { attr: "attackerObj", name: "Lvl" }, ...other)}

                        step={0.5}
                        marks
                        min={Number(this.props.snapshot.attackerObj.Lvl)}
                        max={45}
                    />

                    <Box ml={1}>
                        <IconButton onClick={(event) => this.onPlusMinus(event, { name: "plus" })}
                            style={{ width: 24, height: 24, outline: "none" }}>
                            <AddIcon />
                        </IconButton>
                    </Box>

                </Grid>

                <Grid item xs={12}>
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
                </Grid>

            </Grid >
        )
    }

}

export default Breakpoints;

Breakpoints.propTypes = {
    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    snapshot: PropTypes.object,
};