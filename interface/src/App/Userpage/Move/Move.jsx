import React from "react";
import { getCookie } from "../../../js/getCookie"
import LocalizedStrings from "react-localization"

import AuthButton from "../../Registration/RegForm/AuthButton/AuthButton"
import PveForm from "./PveForm/PveForm"
import { locale } from "../../../locale/locale"


let strings = new LocalizedStrings(locale);


class Move extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            title: "SomeName",
            moveCategory: "Charge Move",
            moveType: "1",

            inputs: {
                damage: "1",
                energy: "-50",
                cooldown: "2",
                damageWindow: "1",
                dodgeWindow: "0.4",
            },

            notOk: {
                damage: "",
                energy: "",
                cooldown: "",
                damageWindow: "",
                dodgeWindow: "",
            },

        }
        this.onInputsChange = this.onInputsChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onInputsChange(event) {
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
            case name === "damage":
                return this.checkDamage(value)
            case name === "energy":
                return this.checkEnergy(value)
            case name === "cooldown" || name === "damageWindow" || name === "dodgeWindow":
                return this.checkCooldown(value)
            default:
                return ""
        }
    }

    checkDamage(damage) {
        //"Damage must be a positive number more than zero"
        let damageNumb = Number(damage)
        if (!damageNumb) { return "error" }
        if (damageNumb <= 0) { return "error" }
        if (!Number.isInteger(damageNumb)) { return "error" }
        return ""
    }

    checkEnergy(energy) {
        //"Damage must be a positive number more than zero"
        let energyNumb = Number(energy)
        if (!energyNumb) { return "error" }
        if (!Number.isInteger(energyNumb)) { return "error" }
        return ""
    }

    checkCooldown(cooldown) {
        let cooldownNumb = Number(cooldown)
        if (!cooldownNumb) { return "error" }
        if (cooldownNumb <= 0) { return "error" }
        return ""
    }

    checkChance(chance) {
        let chanceNumb = Number(chance)
        if (!chanceNumb) { return false }
        if (chanceNumb < 0) { return false }
        if (!Number.isInteger(chanceNumb)) { return false }
        return true
    }

    onSubmit() {
        console.log(this.state.inputs)
    }

    render() {
        return (
            <div className="col p-2 p-md-3">
                <div className="row mx-0">
                    <div className="col-12 px-0 text-center">
                        Move constructor
                    </div>
                    <div className="col-12 px-0 text-center">
                        Move type
                    </div>
                    <div className="col-12 col-md-6 px-0">
                        <PveForm {...this.state.inputs} notOk={this.state.notOk} onChange={this.onInputsChange} />
                    </div>
                    <div className="col-12 col-md-6 px-0">
                        PvP stats
                    </div>
                    <div className="col-12 px-0">
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