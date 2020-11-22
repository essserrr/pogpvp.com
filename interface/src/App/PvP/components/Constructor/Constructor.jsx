import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ConstructorPlayer from "./ConstructorPlayer/ConstructorPlayer";
import Button from "App/Components/Button/Button";

import { constr } from "locale/Pvp/Constructor/Constructor";
import { getCookie } from "js/getCookie";

let constrStrings = new LocalizedStrings(constr);

class Constructor extends React.PureComponent {
    constructor(props) {
        super(props);
        constrStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            Attacker: {
                Action: "Default",
                IsShield: props.log[props.round].Attacker.ShieldIsUsed,
                IsTriggered: props.log[props.round].Attacker.StageA !== 0 || props.log[props.round].Attacker.StageD !== 0,
                actionList: [],
                containCharge: false,
            },
            Defender: {
                Action: "Default",
                IsShield: props.log[props.round].Defender.ShieldIsUsed,
                IsTriggered: props.log[props.round].Defender.StageA !== 0 || props.log[props.round].Defender.StageD !== 0,
                actionList: [],
                containCharge: false,
            },
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    componentDidMount() {
        let attackerList = this.createList("Attacker")
        let defenderList = this.createList("Defender")
        this.setState({
            Attacker: {
                ...this.state.Attacker,
                actionList: attackerList.list,
                containCharge: attackerList.containCharge,
            },
            Defender: {
                ...this.state.Defender,
                actionList: defenderList.list,
                containCharge: defenderList.containCharge,
            },
        })
    }

    appendCharge(chargeName, pokEnergy, array, role, index) {
        if (!chargeName) {
            return false
        }
        if ((this.props.moveTable[chargeName].PvpEnergy + pokEnergy) >= 0) {
            array.push(
                <MenuItem value={chargeName} key={chargeName + role + index}>{chargeName}</MenuItem>
            )
            return true
        }
        return false
    }

    createList(role) {
        let list = [<MenuItem value="Default" key={"default" + role}>{constrStrings.constructor.default}</MenuItem>,]
        let containCharge = false
        switch (this.props.log[this.props.round][role].ActionCode === 1 || this.props.log[this.props.round][role].ActionCode === 11 ||
        this.props.log[this.props.round][role].ActionCode === 0) {
            case true:
                list.push(
                    <MenuItem value={this.props[role].QuickMove} key={this.props[role].QuickMove + role}>{this.props[role].QuickMove}</MenuItem>
                )
                containCharge += this.appendCharge(this.props[role].ChargeMove1, this.props.log[this.props.round - 1][role].Energy,
                    list, role, 1)
                containCharge += this.appendCharge(this.props[role].ChargeMove2, this.props.log[this.props.round - 1][role].Energy,
                    list, role, 2)
                break
            default:
        }
        return { list: list, containCharge: containCharge, }
    }

    onChange(event, attributes, eventItem, ...other) {
        const name = attributes.name;
        const role = attributes.attr;

        if (name === "Action") {
            this.onActionChange(event.target.value, name, role)
            return
        }

        this.setState({
            [role]: {
                ...this.state[role],
                [name]: eventItem,
            }
        })
    }

    onActionChange(value, name, role) {
        const pokemonStatus = this.props.log[this.props.round][role];
        const selectedMove = this.props.moveTable[value];

        const triggered = value === "Default" ?
            pokemonStatus.StageA !== 0 || pokemonStatus.StageD !== 0
            :
            selectedMove.Probability === 1;

        this.setState({
            [role]: {
                ...this.state[role],
                [name]: value,
                IsTriggered: triggered,
            }
        })
    }

    findNext(role, constr) {
        let newConstr = { ...constr };
        let roundsToMove = 0;
        let actionNotFound = true;

        //cont rounds to next move
        for (let i = this.props.round; true; i++) {
            const round = this.props.log[i]
            if (!round) { break; }

            if (round[role].ActionCode === 0) {
                roundsToMove++
            } else {
                actionNotFound = false;
                break;
            }
        }

        switch (actionNotFound) {
            case true:
                newConstr = this.selectAction(role, newConstr)
                break
            default:
                newConstr[role].RoundsToDamage = roundsToMove
                newConstr[role].MoveCooldown = roundsToMove + 1
        }
        return newConstr
    }

    selectAction(role, constr) {
        const pokemon = this.props[role];

        //check if energy is enough to use a charge move
        const chargeMove1 = this.props.moveTable[pokemon.ChargeMove1];
        if (chargeMove1 && (chargeMove1.PvpEnergy + this.props.log[this.props.round - 1][role].Energy) >= 0) {
            constr[role].WhatToSkip = 2
            return constr
        }

        const chargeMove2 = this.props.moveTable[pokemon.ChargeMove2];
        if (chargeMove2 && (chargeMove2.PvpEnergy + this.props.log[this.props.round - 1][role].Energy) >= 0) {
            constr[role].WhatToSkip = 1
            return constr
        }

        let roundsToMove = 0;
        //if non of charge moves are usable, set up duration of quick move
        for (let i = this.props.round; true; i--) {
            const round = this.props.log[i]
            if (round.Round === 0) { break }

            if (round[role].ActionCode === 0) {
                roundsToMove++
            } else {
                break;
            }
        }

        const quickMove = this.props.moveTable[pokemon.QuickMove];
        constr[role].RoundsToDamage = (quickMove.PvpDuration - roundsToMove) < 0 ? 0 : quickMove.PvpDuration - roundsToMove;
        constr[role].MoveCooldown = (quickMove.PvpDurationSeconds - roundsToMove) < 0 ? 0 : quickMove.PvpDurationSeconds / 0.5 - roundsToMove;
        return constr;
    }

    buildConstrObj(pokState, role, constr) {
        const thisRound = this.props.log[this.props.round];
        const activeMove = this.props.moveTable[pokState.Action];

        //check if an action = default
        switch (pokState.Action) {
            case "Default":
                //if the action = default, check action code of this round 
                switch (thisRound[role].ActionCode) {
                    //if the code = idle
                    case 0:
                        //count rounds to the closest move and set up default action
                        constr = this.findNext(role, constr)
                        break
                    //if the code = quick move
                    case 1:
                        constr[role].RoundsToDamage = 0
                        constr[role].MoveCooldown = 1
                        break
                    //if the code is charge move
                    default:
                        constr[role].WhatToSkip = (this.props[role].ChargeMove1 === thisRound[role].ActionName ? 2 : 1);
                        break
                }
                break
            //if action is not default
            default:
                //create new action
                switch (activeMove.MoveCategory) {
                    //charge
                    case "Charge Move":
                        constr[role].WhatToSkip = (this.props[role].ChargeMove1 === pokState.Action ? 2 : 1)
                        break
                    //or quick
                    default:
                        constr[role].RoundsToDamage = activeMove.PvpDuration
                        constr[role].MoveCooldown = activeMove.PvpDurationSeconds / 0.5
                        break
                }
        }
    }

    onSubmit(event) {
        event.preventDefault();

        let constr = {
            Round: this.props.log[this.props.round - 1].Round,
            Attacker: {
                SkipShield: !this.state.Attacker.IsShield,
                IsTriggered: this.state.Attacker.IsTriggered,
                WhatToSkip: 0,
                MoveCooldown: 0,
                RoundsToDamage: 0,
            },
            Defender: {
                SkipShield: !this.state.Defender.IsShield,
                IsTriggered: this.state.Defender.IsTriggered,
                WhatToSkip: 0,
                MoveCooldown: 0,
                RoundsToDamage: 0,
            },
        }

        this.buildConstrObj(this.state.Attacker, "Attacker", constr)
        this.buildConstrObj(this.state.Defender, "Defender", constr)

        this.props.submitConstructor(constr)
    }

    haveTrigger(role) {
        let probability = 0
        switch (this.state[role].Action === "Default") {
            case true:
                const pokStatus = this.props.log[this.props.round][role];
                probability = (pokStatus.ActionName ? this.props.moveTable[pokStatus.ActionName].Probability : 0)
                break
            default:
                probability = this.props.moveTable[this.state[role].Action].Probability
        }

        if (probability === 1 || probability === 0) { return false }
        return true
    }

    render() {
        return (
            <Grid container justify="center" spacing={1}>
                <Grid item xs={12}>

                </Grid>

                {this.props.lastChangesAt > this.props.round &&
                    <Grid item xs={12}>
                        <Alert variant="filled" severity="error">{`${constrStrings.constructor.alertchanges1st} ${this.props.lastChangesAt}${constrStrings.constructor.alertchanges2nd}`}</Alert >
                    </Grid>}

                {this.props.stateModified &&
                    <Grid item xs={12}>
                        <Alert variant="filled" severity="error">{constrStrings.constructor.alertmodified}</Alert >
                    </Grid>}

                <Grid item xs={12}>
                    <Typography variant="h6">
                        {constrStrings.constructor.newaction + this.props.round + ":"}
                    </Typography>
                </Grid>

                {this.state.Attacker.actionList.length > 0 &&
                    <Grid item xs={12}>

                        <ConstructorPlayer
                            attr="Attacker"
                            pokName={this.props.Attacker.name}
                            label={constrStrings.constructor.attacker}

                            onChange={this.onChange}

                            shiledsDisabled={(this.props.agregatedParams.Attacker.Shields === 0) || !this.state.Defender.containCharge}
                            triggerDisabled={!this.haveTrigger("Attacker")}
                        >
                            {this.state.Attacker}
                        </ConstructorPlayer>

                    </Grid>}

                {this.state.Defender.actionList.length > 0 &&
                    <Grid item xs={12}>

                        <ConstructorPlayer
                            attr="Defender"
                            pokName={this.props.Defender.name}
                            label={constrStrings.constructor.defender}

                            onChange={this.onChange}

                            shiledsDisabled={(this.props.agregatedParams.Defender.Shields === 0) || !this.state.Attacker.containCharge}
                            triggerDisabled={!this.haveTrigger("Defender")}
                        >
                            {this.state.Defender}
                        </ConstructorPlayer>

                    </Grid>}

                <Grid item xs="auto">
                    <Button title={constrStrings.constructor.submit} onClick={this.onSubmit} />
                </Grid>

            </Grid>
        )
    }

}

export default Constructor;

Constructor.propTypes = {
    log: PropTypes.array,
    round: PropTypes.number,

    Attacker: PropTypes.object,
    Defender: PropTypes.object,
    moveTable: PropTypes.object,
    agregatedParams: PropTypes.object,

    submitConstructor: PropTypes.func,

    lastChangesAt: PropTypes.number,
    stateModified: PropTypes.bool,
};