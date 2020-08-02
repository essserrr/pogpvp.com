import React from "react";
import { getCookie } from "../../../js/getCookie"
import LocalizedStrings from "react-localization"

import LabelAndInput from "./LabelAndInput/LabelAndInput"
import TypeCategory from "./TypeCategory/TypeCategory"
import AuthButton from "../../Registration/RegForm/AuthButton/AuthButton"
import PveForm from "./PveForm/PveForm"
import PvpForm from "./PvpForm/PvpForm"
import { userLocale } from "../../../locale/userLocale"


let strings = new LocalizedStrings(userLocale);


class Move extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            title: "SomeName",
            moveCategory: "Charge Move",
            moveType: "0",

            inputs: {
                pvpDamage: 1, pvpEnergy: -50,

                damage: 1, energy: -50,

                cooldown: 1, damageWindow: 0.5, dodgeWindow: 0.4,

                pvpDurationSeconds: 1, pvpDuration: 1,

                probability: 0, stat: "", subject: "", stageDelta: 0,
            },

            notOk: {
                title: "",

                pvpDamage: "", pvpEnergy: "",

                damage: "", energy: "",

                cooldown: "", damageWindow: "", dodgeWindow: "",

                pvpDurationSeconds: "", pvpDuration: "",

                probability: "", stat: "", subject: "", stageDelta: "",
            },

        }
        this.onChange = this.onChange.bind(this)
        this.onInputsChange = this.onInputsChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            notOk: {
                ...this.state.notOk,
                [event.target.name]: this.check(event.target.value, event.target.name)
            }
        })
    }

    onInputsChange(event) {
        switch (event.target.name) {
            case "pvpDurationSeconds":
                this.setDuration(event)
                break
            default:
                this.setInputs(event)
        }
    }

    setDuration(event) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [event.target.name]: event.target.value,
                pvpDuration: event.target.value / 0.5 - 1,
            },
            notOk: {
                ...this.state.notOk,
                [event.target.name]: this.check(event.target.value, event.target.name),
                pvpDuration: this.check(event.target.value / 0.5 - 1, "pvpDuration")
            }
        })
    }

    setInputs(event) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [event.target.name]: event.target.value,
            },
            notOk: {
                ...this.state.notOk,
                [event.target.name]: this.check(event.target.value, event.target.name)
            }
        })
    }

    check(value, name) {
        switch (true) {
            case name === "damage" || name === "pvpDamage":
                return this.checkDamage(value)
            case name === "energy" || name === "pvpEnergy":
                return this.checkEnergy(value)
            case name === "cooldown" || name === "damageWindow" || name === "dodgeWindow":
                return this.checkCooldown(value, name)
            case name === "probability":
                return this.checkChance(value)
            case name === "title":
                return this.checkTitle(value)
            default:
                return ""
        }
    }

    checkTitle(str) {
        if (str.length < 2) { return strings.moveconstr.err.mt + strings.err.longer.l1 + "2" + strings.err.lesseq.c }
        if (str.length > 20) { return strings.moveconstr.err.mt + strings.err.lesseq.l1 + "20" + strings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.moveconstr.err.mt + strings.err.symb }
        return ""
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")
    }

    checkDamage(damage) {
        //"Damage must be a positive number more than zero"
        let damageNumb = Number(damage)
        if (Number.isNaN(damageNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.d1 }
        if (damageNumb < 0) { return strings.moveconstr.err.d2 + strings.moveconstr.err.larzero }
        if (!Number.isInteger(damageNumb)) { return strings.moveconstr.err.d2 + strings.moveconstr.err.integr }
        return ""
    }

    checkEnergy(energy) {
        //"Damage must be a positive number more than zero"
        let energyNumb = Number(energy)
        if (Number.isNaN(energyNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.e1 }
        if (this.state.moveCategory === "Charge Move" && energy > 0) { return strings.moveconstr.err.e2 + strings.moveconstr.err.neg }
        if (this.state.moveCategory === "Fast Move" && energy < 0) { return strings.moveconstr.err.e2 + strings.moveconstr.err.pos }
        if (!Number.isInteger(energyNumb)) { return strings.moveconstr.err.e2 + strings.moveconstr.err.integrfem }
        if (Math.abs(energyNumb) > 100) { return strings.moveconstr.err.allowed }
        return ""
    }

    checkCooldown(cooldown, name) {
        let cooldownNumb = Number(cooldown)
        if (Number.isNaN(cooldownNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.cd1 }
        if (cooldownNumb <= 0) { return strings.moveconstr.err.cd2 + strings.moveconstr.err.larzerofem }

        let newCd = { ...this.state.inputs }
        newCd[name] = cooldown
        if (Number(newCd.cooldown) <= Number(newCd.damageWindow) + Number(newCd.dodgeWindow)) {
            return strings.moveconstr.err.sumwind
        }
        return ""
    }

    checkChance(chance) {
        let chanceNumb = Number(chance)
        if (Number.isNaN(chanceNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.pr1 }
        if (chanceNumb < 0) { return strings.moveconstr.err.pr2 + strings.moveconstr.err.poszer }
        if (!Number.isInteger(chanceNumb)) { return strings.moveconstr.err.pr2 + strings.moveconstr.err.integrfem }
        if (chanceNumb > 100) { return strings.moveconstr.err.hundred }
        return ""
    }

    onSubmit() {
        console.log(this.state)
    }

    render() {
        return (
            <div className="col p-2 p-md-3">
                <div className="row mx-0">
                    <div className="col-12 px-0 py-1 text-center">
                        Move constructor
                    </div>
                    <div className="col-12 px-0">
                        <div className="row mx-0 justify-content-center">
                            <div className="col-12 col-md-6 px-1">
                                <LabelAndInput
                                    label={strings.moveconstr.err.mt}

                                    attr={""}
                                    name={"title"}

                                    value={this.state.title}
                                    notOk={this.state.notOk.title}

                                    type={"text"}

                                    onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <TypeCategory onChange={this.onChange}
                        moveCategory={this.state.moveCategory} moveType={this.state.moveType} />
                    <div className="col-12 col-md-6 px-1">
                        <PveForm {...this.state.inputs} moveCategory={this.state.moveCategory} notOk={this.state.notOk}
                            onChange={this.onInputsChange} />
                    </div>
                    <div className="col-12 col-md-6 px-1">
                        <PvpForm {...this.state.inputs} moveCategory={this.state.moveCategory} notOk={this.state.notOk}
                            onChange={this.onInputsChange}
                        />
                    </div>
                    <div className="col-12 px-1">
                        <div className="row m-0 pt-3 justify-content-center">
                            <AuthButton
                                loading={this.state.loading}
                                title={"Print"}
                                onClick={this.onSubmit}
                                disabled={
                                    Object.values(this.state.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Move