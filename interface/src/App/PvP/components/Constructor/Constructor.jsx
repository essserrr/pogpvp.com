import React from "react";
import LocalizedStrings from "react-localization";

import Alert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";

import Checkbox from "../../../RaidsList/Checkbox/Checkbox"
import Button from "App/Components/Button/Button";

import { constr } from "locale/Pvp/Constructor/Constructor";
import { getCookie } from "../../../../js/getCookie"

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

    onChange(event, attributes) {
        const name = attributes.name;

        const isBoolean = name === "IsShield" || name === "IsTriggered";

        const role = attributes.attr;
        const value = isBoolean ? !this.state[role][name] : event.target.value;

        if (name === "Action" && value !== "Default" && this.props.moveTable[value].Probability === 1) {
            this.setState({
                [role]: {
                    ...this.state[role],
                    [name]: value,
                    IsTriggered: true,
                }
            })
            return
        }


        this.setState({
            [role]: {
                ...this.state[role],
                [name]: value,
            }
        })
    }

    findNext(role, constr) {
        let roundsToMove = 0
        let toLoop = true
        let upperNotFound = false
        for (let i = this.props.round; toLoop; i++) {
            if (!this.props.log[i]) {
                toLoop = false
                upperNotFound = true
                break
            }
            switch (this.props.log[i][role].ActionCode) {
                case 0:
                    roundsToMove++
                    break
                default:
                    toLoop = false
                    break
            }
        }

        switch (upperNotFound) {
            case true:
                roundsToMove = 0
                toLoop = true
                upperNotFound = false

                //check if energy is enough to use a charge move
                if (this.props[role].ChargeMove1 &&
                    (this.props.moveTable[this.props[role].ChargeMove1].PvpEnergy + this.props.log[this.props.round - 1][role].Energy) >= 0) {
                    constr[role].WhatToSkip = 2
                    break
                }

                if (this.props[role].ChargeMove2 &&
                    (this.props.moveTable[this.props[role].ChargeMove2].PvpEnergy + this.props.log[this.props.round - 1][role].Energy) >= 0) {
                    constr[role].WhatToSkip = 1
                    break
                }


                //if non of charge moves are usable, set up duration of quick move
                for (let i = this.props.round; toLoop; i--) {
                    if (this.props.log[i].Round === 0) {
                        toLoop = false
                    }
                    switch (this.props.log[i][role].ActionCode) {
                        case 0:
                            roundsToMove++
                            break
                        default:
                            toLoop = false
                            break
                    }
                }
                constr[role].RoundsToDamage = (((this.props.moveTable[this.props[role].QuickMove].PvpDuration - roundsToMove) < 0) ?
                    0 : this.props.moveTable[this.props[role].QuickMove].PvpDuration - roundsToMove)
                constr[role].MoveCooldown = (((this.props.moveTable[this.props[role].QuickMove].PvpDurationSeconds - roundsToMove) < 0) ?
                    0 : this.props.moveTable[this.props[role].QuickMove].PvpDurationSeconds - roundsToMove)
                break
            default:
                constr[role].RoundsToDamage = roundsToMove
                constr[role].MoveCooldown = roundsToMove + 1
        }
    }

    buildConstrObj(pokState, role, constr) {
        //check if an action = default
        switch (pokState.Action) {
            case "Default":
                //if the action = default, check action code of this round 
                switch (this.props.log[this.props.round][role].ActionCode) {
                    //if the code = idle
                    case 0:
                        //count rounds to the closest move and set up default action
                        this.findNext(role, constr)
                        break
                    //if the code = quick move
                    case 1:
                        constr[role].RoundsToDamage = 0
                        constr[role].MoveCooldown = 1
                        break
                    //if the code is charge move
                    default:
                        constr[role].WhatToSkip = (this.props[role].ChargeMove1 === this.props.log[this.props.round][role].ActionName ? 2 : 1)
                        break
                }
                break
            //if action is not default
            default:
                //create new action
                switch (this.props.moveTable[pokState.Action].MoveCategory) {
                    //charge
                    case "Charge Move":
                        constr[role].WhatToSkip = (this.props[role].ChargeMove1 === pokState.Action ? 2 : 1)
                        break
                    //or quick
                    default:
                        constr[role].RoundsToDamage = this.props.moveTable[pokState.Action].PvpDuration
                        constr[role].MoveCooldown = this.props.moveTable[pokState.Action].PvpDurationSeconds / 0.5
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
                probability = (this.props.log[this.props.round][role].ActionName ?
                    this.props.moveTable[this.props.log[this.props.round][role].ActionName].Probability : 0)
                break
            default:
                probability = this.props.moveTable[this.state[role].Action].Probability
        }

        if (probability === 1) {
            probability = 0
        }
        return probability
    }

    render() {
        console.log(this.state.Attacker.Action)
        return (
            <div className="row justify-content-center m-0 my-1">

                {(this.props.lastChangesAt > this.props.round) &&
                    <div className="col-12 p-0">
                        <Alert variant="filled" severity="error">{constrStrings.constructor.alertchanges1st + this.props.lastChangesAt + constrStrings.constructor.alertchanges2nd}</Alert >
                    </div>}

                {this.props.stateModified &&
                    <div className="col-12 p-0 my-1">
                        <Alert variant="filled" severity="error">{constrStrings.constructor.alertmodified}</Alert >
                    </div>}

                <div className="constructor__title col-12 p-0">
                    {constrStrings.constructor.newaction + this.props.round + ":"}
                </div>

                {this.state.Attacker.actionList.length > 0 &&
                    <div className="col-12 p-0">
                        <WithIcon tip={this.props.Attacker.name}>
                            <Input select name="Action" value={String(this.state.Attacker.Action)}
                                attr={"Attacker"} label={constrStrings.constructor.attacker} onChange={this.onChange}>

                                {this.state.Attacker.actionList}

                            </Input>
                        </WithIcon>
                    </div>}

                <div className="constructor--text col-12 d-flex p-0 my-1">
                    <Checkbox
                        onChange={this.onChange}
                        value={this.state.Attacker.IsShield}
                        checked={(this.state.Attacker.IsShield) ? "checked" : false}
                        name={"IsShield"}
                        attr={"Attacker"}
                        label={constrStrings.constructor.useshield}
                        isDisabled={(this.props.agregatedParams.Attacker.Shields === 0) || !this.state.Defender.containCharge}

                    />
                    <Checkbox
                        onChange={this.onChange}
                        value={this.state.Attacker.IsTriggered}
                        isDisabled={!this.haveTrigger("Attacker")}

                        checked={this.state.Attacker.IsTriggered ? "checked" : false}
                        name={"IsTriggered"}
                        attr={"Attacker"}
                        label={constrStrings.constructor.trigger}
                    />
                </div>
                <div className="col-12 p-0">

                    {this.state.Defender.actionList.length > 0 &&
                        <WithIcon tip={this.props.Defender.name}>
                            <Input select name="Action" value={String(this.state.Defender.Action)}
                                attr={"Defender"} label={constrStrings.constructor.defender} onChange={this.onChange}>

                                {this.state.Defender.actionList}

                            </Input>
                        </WithIcon>}

                </div>
                <div className="constructor--text col-12 d-flex p-0 my-1 mb-3">
                    <Checkbox
                        onChange={this.onChange}
                        value={this.state.Defender.IsShield}
                        checked={(this.state.Defender.IsShield) ? "checked" : false}
                        name={"IsShield"}
                        attr={"Defender"}
                        label={constrStrings.constructor.useshield}
                        isDisabled={(this.props.agregatedParams.Defender.Shields === 0) || !this.state.Attacker.containCharge}
                    />
                    <Checkbox
                        onChange={this.onChange}
                        value={this.state.Defender.IsTriggered}
                        isDisabled={!this.haveTrigger("Defender")}
                        checked={this.state.Defender.IsTriggered ? "checked" : false}
                        name={"IsTriggered"}
                        attr={"Defender"}

                        label={constrStrings.constructor.trigger}
                    />
                </div>


                <Button
                    title={constrStrings.constructor.submit}
                    onClick={this.onSubmit}
                />

            </div>
        )
    }

}


export default Constructor;