import React from "react";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { getCustomMoves } from "AppStore/Actions/getCustomMoves"
import { refresh } from "AppStore/Actions/refresh"
import { setCustomMoves } from "AppStore/Actions/actions"
import CustomMoveListWrapper from "App/Userpage/CustomMoves/CustomMoveListWrapper/CustomMoveListWrapper"
import UserPageContent from "App/Userpage/UserPageContent/UserPageContent";

import SiteHelm from "App/SiteHelm/SiteHelm";
import CustomMoveContsructorForm from "./CustomMoveContsructorForm/CustomMoveContsructorForm";
import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomMoves/CustomMoves"

let strings = new LocalizedStrings(userLocale);

class Move extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: {
                Title: { value: "", error: "", },
                MoveCategory: { value: "Charge Move", error: "", },
                MoveType: { value: "0", error: "", },

                Subject: { value: "", error: "", },

                StageDelta: { value: 0, error: "", },
                PvpDurationSeconds: { value: 0, error: "", },
                PvpDuration: { value: 0, error: "", },

                PvpDamage: { value: 1, error: "", },
                PvpEnergy: { value: -50, error: "", },
                Damage: { value: 1, error: "", },

                Energy: { value: -50, error: "", },
                Probability: { value: 0, error: "", },
                Stat: { value: "", error: "", },

                Cooldown: { value: 1, error: "", },
                DamageWindow: { value: 0.5, error: "", },
                DodgeWindow: { value: 0.4, error: "", },
            },

            moves: {

            },

            loading: false,
            error: "",
        }
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

    onChange = (event) => {
        switch (event.target.name) {
            case "PvpDurationSeconds":
                this.setDuration(event)
                return
            case "MoveCategory":
                this.onCategoryChange(event)
                return
            default:
                this.setState({
                    inputs: {
                        ...this.state.inputs,
                        [event.target.name]: {
                            value: event.target.value,
                            error: this.check(event.target.value, event.target.name),
                        },
                    },
                })
        }
    }

    onCategoryChange = (event) => {
        const chargeDefault = {
            PvpEnergy: { value: -50, error: "", },
            Energy: { value: -50, error: "", },
            Stat: { value: "", error: "", },
            Subject: { value: "", error: "", },
            Probability: { value: 0, error: "", },
            StageDelta: { value: 0, error: "", },
            PvpDurationSeconds: { value: 0, error: "", },
            PvpDuration: { value: 0, error: "", },
        };

        const quickDefault = {
            PvpEnergy: { value: 1, error: "", },
            Energy: { value: 1, error: "", },
            Stat: { value: "", error: "", },
            Subject: { value: "", error: "", },
            Probability: { value: 0, error: "", },
            StageDelta: { value: 0, error: "", },
            PvpDurationSeconds: { value: 0.5, error: "", },
            PvpDuration: { value: 1, error: "", },
        };

        this.setState({
            inputs: {
                ...this.state.inputs,
                MoveCategory: {
                    value: event.target.value,
                    error: "",
                },
                ...(event.target.value === "Charge Move" ? chargeDefault : quickDefault),
            },
        })
    }

    setDuration(event) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [event.target.name]: {
                    value: event.target.value,
                    error: this.check(event.target.value, event.target.name),
                },
                PvpDuration: {
                    value: event.target.value / 0.5 - 1,
                    error: this.check(event.target.value / 0.5 - 1, "PvpDuration"),
                },
            },
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
        const cooldownNumb = Number(cooldown)
        if (Number.isNaN(cooldownNumb)) { return strings.moveconstr.err.wrong + strings.moveconstr.err.cd1 }
        if (cooldownNumb <= 0) { return strings.moveconstr.err.cd2 + strings.moveconstr.err.larzerofem }
        if (Math.abs(cooldown) > 60) { return strings.moveconstr.err.cdallowed }

        const newCd = { ...this.state.inputs, [name]: { value: cooldownNumb } }

        if (Number(newCd.Cooldown.value) < Number(newCd.DamageWindow.value) + Number(newCd.DodgeWindow.value)) {
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
        if (!this.validate() || Object.keys(this.state.moves).length > 100) {
            return
        }
        const moveName = this.state.inputs.Title.value.trim()
        this.setState({
            moves: {
                ...this.state.moves,
                [moveName]: {
                    Title: moveName,
                    MoveCategory: this.state.inputs.MoveCategory.value,
                    MoveType: Number(this.state.inputs.MoveType.value),

                    Subject: this.state.inputs.Subject.value,

                    StageDelta: Number(this.state.inputs.StageDelta.value),
                    PvpDurationSeconds: Number(this.state.inputs.PvpDurationSeconds.value),
                    PvpDuration: Number(this.state.inputs.PvpDuration.value),

                    PvpDamage: Number(this.state.inputs.PvpDamage.value),
                    PvpEnergy: Number(this.state.inputs.PvpEnergy.value),
                    Damage: Number(this.state.inputs.Damage.value),

                    Energy: Number(this.state.inputs.Energy.value),
                    Probability: Number(this.state.inputs.Probability.value),
                    Stat: this.state.inputs.Stat.value.split(","),

                    Cooldown: Number(this.state.inputs.Cooldown.value) * 1000,
                    DamageWindow: Number(this.state.inputs.DamageWindow.value) * 1000,
                    DodgeWindow: Number(this.state.inputs.DodgeWindow.value) * 1000,
                }
            }
        })
    }

    onMoveOpen(event, move) {
        if (event.target.getAttribute("name") === "closeButton") return;
        this.setState({
            inputs: {
                Title: { value: move.Title, error: "", },
                MoveCategory: { value: move.MoveCategory, error: "", },
                MoveType: { value: move.MoveType, error: "", },

                PvpDamage: { value: move.PvpDamage, error: "", },

                PvpEnergy: { value: move.PvpEnergy, error: "", },
                Damage: { value: move.Damage, error: "", },
                Energy: { value: move.Energy, error: "", },

                Cooldown: { value: move.Cooldown / 1000, error: "", },
                DamageWindow: { value: move.DamageWindow / 1000, error: "", },
                DodgeWindow: { value: move.DodgeWindow / 1000, error: "", },

                PvpDurationSeconds: { value: move.PvpDurationSeconds, error: "", },
                PvpDuration: { value: move.PvpDuration, error: "", },
                Probability: { value: move.Probability, error: "", },

                Stat: { value: move.Stat.join(","), error: "", },
                Subject: { value: move.Subject, error: "", },
                StageDelta: { value: move.StageDelta, error: "", },
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
        let checkedInputs = {}
        for (const [key, input] of Object.entries(this.state.inputs)) {
            checkedInputs[key] = { value: input.value, error: this.check(input.value, key), }
        }
        this.setState({ inputs: checkedInputs, })
        return Object.values(checkedInputs).reduce((sum, value) => sum && value.error === "", true)
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
                            <CustomMoveContsructorForm
                                onChange={this.onChange}
                                onMoveAdd={this.onMoveAdd}
                                submitDisabled={!Object.values(this.state.inputs).reduce((sum, input) => sum && input.error === "", true)}
                                {...this.state.inputs}
                            />
                        </UserPageContent>

                        <Box mt={5}>
                            <UserPageContent title={`${strings.moveconstr.umoves} ${customMoves.length}/100`}>
                                <CustomMoveListWrapper onMoveOpen={this.onMoveOpen} onMoveDelete={this.onMoveDelete}>
                                    {this.state.moves}
                                </CustomMoveListWrapper>
                            </UserPageContent>
                        </Box>
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