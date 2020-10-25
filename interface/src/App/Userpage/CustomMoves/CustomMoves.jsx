import React from "react";
import { getCookie } from "../../../js/getCookie";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { getCustomMoves } from "../../../AppStore/Actions/getCustomMoves"
import { refresh } from "../../../AppStore/Actions/refresh"
import { setCustomMoves } from "../../../AppStore/Actions/actions"
import CustomMoveListWrapper from "./CustomMoveListWrapper/CustomMoveListWrapper"
import UserPageContent from "../UserPageContent/UserPageContent";

import SiteHelm from "../../SiteHelm/SiteHelm"
import TypeCategory from "./TypeCategory/TypeCategory"
import AuthButton from "../../Registration/RegForm/AuthButton/AuthButton"
import PveForm from "./PveForm/PveForm"
import PvpForm from "./PvpForm/PvpForm"

import InputWithError from "../../Components/InputWithError/InputWithError"


import { userLocale } from "../../../locale/UserPage/CustomMoves/CustomMoves"

import "./MoveConstructor.scss"

let strings = new LocalizedStrings(userLocale);

class Move extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            Title: "",
            MoveCategory: "Charge Move",
            MoveType: "0",

            inputs: {
                PvpDamage: 1, PvpEnergy: -50,
                Damage: 1, Energy: -50,
                Cooldown: 1, DamageWindow: 0.5, DodgeWindow: 0.4,
                PvpDurationSeconds: 0, PvpDuration: 0,
                Probability: 0, Stat: "", Subject: "", StageDelta: 0,
            },

            notOk: {
                Title: "",
                PvpDamage: "", PvpEnergy: "",
                Damage: "", Energy: "",
                Cooldown: "", DamageWindow: "", DodgeWindow: "",
                PvpDurationSeconds: "", PvpDuration: "",
                Probability: "", Stat: "", Subject: "", StageDelta: "",
            },
            moves: {},

            loading: false,
            error: "",
        }
        this.onChange = this.onChange.bind(this)
        this.onInputsChange = this.onInputsChange.bind(this)

        this.onMoveAdd = this.onMoveAdd.bind(this)
        this.onMoveOpen = this.onMoveOpen.bind(this)
        this.onMoveDelete = this.onMoveDelete.bind(this)
    }

    async componentDidMount() {
        this.setState({ loading: true })
        await this.props.refresh()
        await this.props.getCustomMoves()
        this.setState({ loading: false, moves: this.props.customMoves.moves })
    }

    onChange(event) {
        switch (event.target.name) {
            case "MoveCategory":
                this.onCategoryChange(event)
                return
            default:
                this.setState({
                    [event.target.name]: event.target.value,
                    notOk: {
                        ...this.state.notOk,
                        [event.target.name]: this.check(event.target.value, event.target.name)
                    }
                })
        }
    }

    onCategoryChange(event) {
        const chargeDefault = { PvpEnergy: "-50", Energy: "-50", Stat: "", Subject: "", Probability: "0", StageDelta: "0", PvpDurationSeconds: "0", PvpDuration: "0", }
        const quickDefault = { PvpEnergy: "1", Energy: "1", Stat: "", Subject: "", Probability: "0", StageDelta: "0", PvpDurationSeconds: "0.5", PvpDuration: "0", }
        const okDefault = { PvpEnergy: "", Energy: "", Stat: "", Subject: "", Probability: "", StageDelta: "", PvpDurationSeconds: "", PvpDuration: "", }

        this.setState({
            [event.target.name]: event.target.value,
            inputs: {
                ...this.state.inputs,
                ...(event.target.value === "Charge Move" ? chargeDefault : quickDefault),
            },
            notOk: {
                ...this.state.notOk,
                ...okDefault,
                [event.target.name]: this.check(event.target.value, event.target.name),
            }
        })
    }

    onInputsChange(event) {
        switch (event.target.name) {
            case "PvpDurationSeconds":
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
                PvpDuration: event.target.value / 0.5 - 1,
            },
            notOk: {
                ...this.state.notOk,
                [event.target.name]: this.check(event.target.value, event.target.name),
                PvpDuration: this.check(event.target.value / 0.5 - 1, "PvpDuration")
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
            case name === "Damage" || name === "PvpDamage":
                return this.checkDamage(value)
            case name === "Energy" || name === "PvpEnergy":
                return this.checkEnergy(value)
            case name === "Cooldown" || name === "DamageWindow" || name === "DodgeWindow":
                return this.checkCooldown(value, name)
            case name === "Probability":
                return this.checkChance(value)
            case name === "Title":
                return this.checkTitle(value)
            default:
                return ""
        }
    }

    checkTitle(str) {
        if (str.length < 2) { return strings.moveconstr.err.mt1 + strings.err.longer.l1 + "2" + strings.err.lesseq.c }
        if (str.length > 20) { return strings.moveconstr.err.mt1 + strings.err.lesseq.l1 + "20" + strings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.moveconstr.err.mt1 + strings.err.symb }
        if (!str.replace(/\s/g, '').length) { return strings.moveconstr.err.wrong + strings.moveconstr.err.mt2 }
        return ""
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+= ]*)$")
    }

    checkDamage(damage) {
        //"Damage must be a positive number more than zero"
        let damageNumb = Number(damage)
        if (Number.isNaN(damageNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.d1 }
        if (damageNumb < 0) { return strings.moveconstr.err.d2 + strings.moveconstr.err.larzero }
        if (!Number.isInteger(damageNumb)) { return strings.moveconstr.err.d2 + strings.moveconstr.err.integr }
        if (Math.abs(damageNumb) > 65000) { return strings.moveconstr.err.damageallowed }
        return ""
    }

    checkEnergy(energy) {
        //"Damage must be a positive number more than zero"
        let energyNumb = Number(energy)
        if (Number.isNaN(energyNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.e1 }
        if (this.state.MoveCategory === "Charge Move" && energy > 0) { return strings.moveconstr.err.e2 + strings.moveconstr.err.neg }
        if (this.state.MoveCategory === "Fast Move" && energy < 0) { return strings.moveconstr.err.e2 + strings.moveconstr.err.pos }
        if (!Number.isInteger(energyNumb)) { return strings.moveconstr.err.e2 + strings.moveconstr.err.integrfem }
        if (Math.abs(energyNumb) > 100) { return strings.moveconstr.err.allowed }
        return ""
    }

    checkCooldown(cooldown, name) {
        let cooldownNumb = Number(cooldown)
        if (Number.isNaN(cooldownNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.cd1 }
        if (cooldownNumb <= 0) { return strings.moveconstr.err.cd2 + strings.moveconstr.err.larzerofem }
        if (Math.abs(cooldown) > 60) { return strings.moveconstr.err.cdallowed }

        let newCd = { ...this.state.inputs, [name]: cooldown }

        if (Number(newCd.Cooldown) < Number(newCd.DamageWindow) + Number(newCd.DodgeWindow)) {
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

    onMoveAdd() {
        if (!this.validate() || Object.keys(this.state.moves).length >= 100) {
            return
        }
        this.setState({
            moves: {
                ...this.state.moves,
                [this.state.Title]: {
                    Title: this.state.Title.trim(),
                    MoveCategory: this.state.MoveCategory,
                    MoveType: Number(this.state.MoveType),
                    ...this.state.inputs,

                    StageDelta: Number(this.state.inputs.StageDelta),
                    PvpDurationSeconds: Number(this.state.inputs.PvpDurationSeconds),
                    PvpDuration: Number(this.state.inputs.PvpDuration),
                    PvpDamage: Number(this.state.inputs.PvpDamage),
                    PvpEnergy: Number(this.state.inputs.PvpEnergy),
                    Damage: Number(this.state.inputs.Damage),
                    Energy: Number(this.state.inputs.Energy),
                    Probability: Number(this.state.inputs.Probability),
                    Stat: this.state.inputs.Stat.split(","),
                    Cooldown: Number(this.state.inputs.Cooldown) * 1000,
                    DamageWindow: Number(this.state.inputs.DamageWindow) * 1000,
                    DodgeWindow: Number(this.state.inputs.DodgeWindow) * 1000
                }
            }
        })
    }

    onMoveOpen(move) {
        this.setState({
            Title: move.Title,
            MoveCategory: move.MoveCategory,
            MoveType: move.MoveType,
            inputs: {
                PvpDamage: move.PvpDamage, PvpEnergy: move.PvpEnergy, Damage: move.Damage, Energy: move.Energy,
                Cooldown: move.Cooldown / 1000, DamageWindow: move.DamageWindow / 1000, DodgeWindow: move.DodgeWindow / 1000,
                PvpDurationSeconds: move.PvpDurationSeconds, PvpDuration: move.PvpDuration, Probability: move.Probability,
                Stat: move.Stat.join(","), Subject: move.Subject, StageDelta: move.StageDelta,
            },
        })
    }

    onMoveDelete(move) {
        let newList = { ...this.state.moves }
        delete newList[move.Title]
        this.setState({
            moves: newList,
        })
    }

    validate() {
        let notOk = { Title: this.check(this.state.Title, "Title") }
        for (const [key, value] of Object.entries(this.state.inputs)) {
            notOk[key] = this.check(value, key)
        }
        this.setState({ notOk: notOk, })
        return !Object.values(notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)
    }

    render() {
        const customMoves = Object.entries(this.state.moves).map((value) => value[1]).sort((a, b) => a.Title.localeCompare(b.Title))

        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/profile/move"
                    header={strings.pageheaders.usrmoves}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                {this.state.loading &&
                    <Grid item xs={12}>
                        <LinearProgress color="secondary" />
                    </ Grid>}
                {this.state.error !== "" && <Alert variant="filled" severity="error">{this.state.error}</Alert >}

                {this.state.error === "" && !this.state.loading &&
                    <Grid item xs={12}>
                        <UserPageContent title={strings.moveconstr.constr}>
                            <Grid container justify="center" spacing={1}>
                                <Grid item xs={12} container justify="center">
                                    <Grid item xs={12} md={6}>
                                        <InputWithError
                                            label={strings.moveconstr.title}
                                            name={"Title"}
                                            type={"text"}

                                            value={this.state.Title}
                                            errorText={this.state.notOk.Title}

                                            onChange={this.onChange}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} container justify="center">
                                    <TypeCategory onChange={this.onChange}
                                        moveCategory={this.state.MoveCategory} moveType={this.state.MoveType} />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <PveForm {...this.state.inputs} moveCategory={this.state.MoveCategory} notOk={this.state.notOk}
                                        onChange={this.onInputsChange} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <PvpForm {...this.state.inputs} moveCategory={this.state.MoveCategory} notOk={this.state.notOk}
                                        onChange={this.onInputsChange}
                                    />
                                </Grid>
                                <Grid item xs={12} container justify="center">
                                    <AuthButton
                                        title={strings.moveconstr.add}
                                        onClick={this.onMoveAdd}
                                        disabled={Object.values(this.state.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)}
                                    />
                                </Grid>
                            </Grid>
                        </UserPageContent>
                        <UserPageContent title={`${strings.moveconstr.umoves} ${customMoves.length}/100`}>
                            <CustomMoveListWrapper onMoveOpen={this.onMoveOpen} onMoveDelete={this.onMoveDelete}>
                                {this.state.moves}
                            </CustomMoveListWrapper>
                        </UserPageContent>
                    </Grid>}
            </Grid>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        getCustomMoves: () => dispatch(getCustomMoves()),
        setCustomMoves: moves => dispatch(setCustomMoves(moves))
    }
}

export default connect(
    state => ({
        customMoves: state.customMoves,
    }), mapDispatchToProps
)(Move)