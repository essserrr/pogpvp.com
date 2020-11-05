import React from "react";
import SiteHelm from "App/SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import ShBrokerForm from "App/Userpage/UserShinyBroker/ShBrokerForm/ShBrokerForm";
import ShBrokerSelectPanel from "App/Userpage/UserShinyBroker/ShBrokerSelectPanel/ShBrokerSelectPanel";
import Button from "App/Components/Button/Button";
import SelectedUsers from "./SelectedUsers/SelectedUsers";

import { refresh } from "AppStore/Actions/refresh";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import { getCookie } from "js/getCookie";
import { shinyBroker } from "locale/UserPage/ShinyBroker/ShinyBroker";
import { errors } from "locale/UserPage/Errors";

let strings = new LocalizedStrings(shinyBroker);
let errorStrings = new LocalizedStrings(errors);

class ShinyBroker extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        errorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: {
                Country: "", Region: "", City: "", Contacts: "",
            },

            notOk: {
                Country: "", Region: "", City: "", Contacts: "",
            },

            selectedUsers: [],
            pokList: [],

            HaveCustom: false,
            WantCustom: false,
            Have: {},
            Want: {},


            loading: false,
            error: "",
            submitting: false,
        };

        this.selectCountry = this.selectCountry.bind(this)
        this.selectRegion = this.selectRegion.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmitFilter = this.onSubmitFilter.bind(this)
        this.onPokemonAdd = this.onPokemonAdd.bind(this)
        this.onPokemonDelete = this.onPokemonDelete.bind(this)
        this.onCheckboxChange = this.onCheckboxChange.bind(this)
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })
        await this.props.refresh()
        try {
            let fetches = [
                this.props.getPokemonBase(),
                (navigator.userAgent !== "ReactSnap") && navigator.userAgent !== "ReactSnap" && fetch(
                    process.env.REACT_APP_LOCALHOST + "/api/user/getbroker", {
                    method: "GET",
                    credentials: "include",
                })]

            let responses = await Promise.all(fetches)

            let userBroker = (navigator.userAgent !== "ReactSnap") ? await responses[1].json() : {}

            if (!responses[0].ok) { throw responses[0].detail }

            this.setState({
                loading: false, error: "",
                pokList: this.returnPokList(this.props.bases.pokemonBase),

                inputs: {
                    ...this.state.inputs,
                    Country: userBroker.Country ? userBroker.Country : "",
                    Region: userBroker.Region ? userBroker.Region : "",
                    City: userBroker.City ? userBroker.City : "",
                }
            })
        } catch (e) {
            this.setState({ loading: false, error: String(e) })
        }
    }

    returnPokList(pokBase) {
        return Object.entries(pokBase).map((value) => ({ value: value[0], title: value[0], }))
    }


    onChange(event) {
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
            case name === "Country":
                return this.checkSelect(value, name)
            case name === "Region":
                return this.checkSelect(value, name)
            case name === "City":
                return this.checkCity(value)
            case name === "Contacts":
                return this.checkContacts(value)
            default:
                return ""
        }
    }

    checkSelect(str, name) {
        if (name === "Country" && str === "") { return strings.shbroker.cPlace }
        return ""
    }

    checkCity(str) {
        if (str.length < 0) { return strings.shbroker.err.c1 + errorStrings.err.longer.l1 + "0" + errorStrings.err.lesseq.c }
        if (str.length > 36) { return strings.shbroker.err.c1 + errorStrings.err.lesseq.l1 + "36" + errorStrings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.c1 + errorStrings.err.symb2 }
        if (!str.replace(/\s/g, '').length && str !== "") { return strings.shbroker.err.wrong + strings.shbroker.err.c2 }
        return ""
    }

    checkContacts(str) {
        if (str.length < 0) { return strings.shbroker.err.cd1 + errorStrings.err.longer.l3 + "0" + errorStrings.err.lesseq.c }
        if (str.length > 150) { return strings.shbroker.err.cd1 + errorStrings.err.lesseq.l3 + "150" + errorStrings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.cd1 + errorStrings.err.symb2 }
        if (!str.replace(/\s/g, '').length && str !== "") { return strings.shbroker.err.wrong + strings.shbroker.err.cd2 }
        return ""
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.,!():$%^&*+= ]*)$")
    }

    validate() {
        let notOk = {}
        for (const [key, value] of Object.entries(this.state.inputs)) {
            switch (key === "Country" || value !== "") {
                case true:
                    notOk[key] = this.check(value, key)
                    break
                default:
                    notOk[key] = this.state.notOk[key]

            }
        }

        this.setState({ notOk: notOk, })
        return !Object.values(notOk).reduce((sum, val) => sum || (val !== ""), false)
    }

    async onSubmitFilter() {
        if (!this.validate()) {
            return
        }
        this.setState({
            submitting: true, submittingError: "", ok: false,
        })
        await this.props.refresh()
        try {
            const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/filterbrokers", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(
                    {
                        Country: this.state.inputs.Country, Region: this.state.inputs.Region, City: this.state.inputs.City, Contacts: this.state.inputs.Contacts,
                        Have: this.state.Have,
                        Want: this.state.Want,
                        HaveCustom: this.state.HaveCustom,
                        WantCustom: this.state.WantCustom,
                    })
            })
            //parse answer
            const data = await response.json();
            //if response is not ok, handle error
            if (!response.ok) {
                throw data.detail
            }

            //show ok
            this.setState({ submitting: false, selectedUsers: data })
        } catch (e) {
            this.setState({
                submitting: false,
                submittingError: String(e),
            });
        }
    }

    selectCountry(event, atrributes, eventItem) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                Country: eventItem.value,
                Region: "",
            },
            notOk: {
                ...this.state.notOk,
                Country: this.check(eventItem.value, "Country"),
            }

        });
    }

    selectRegion(event, atrributes, eventItem) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                Region: eventItem.value
            },
            notOk: {
                ...this.state.notOk,
                Region: this.check(eventItem.value, "Region"),
            }
        });
    }

    onPokemonAdd(event, atrributes, eventItem) {
        if (Object.keys(this.state[atrributes.attr]).length > 10) { return }

        this.setState({
            [atrributes.attr]: {
                ...this.state[atrributes.attr],
                [eventItem.value]: { Name: eventItem.value, Type: "Shiny", },
            }
        })
    }

    onPokemonDelete(event) {
        let updatedObj = { ...this.state[event.attr] }
        delete updatedObj[event.index]

        this.setState({
            [event.attr]: updatedObj,
        })
    }

    onCheckboxChange(event, atrributes, eventItem) {
        this.setState({
            [atrributes.attr]: eventItem,
        })
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/shinybroker"
                    header={strings.pageheaders.broker}
                    descr={strings.pagedescriptions.broker}
                />
                <Grid item xs={12} md={10} lg={8}>
                    <GreyPaper elevation={4} enablePadding={true} >
                        <Grid container justify="center" spacing={2}>
                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            {!this.state.loading && !this.state.error &&
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" align="center">
                                            {strings.shbroker.int.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ShBrokerForm
                                            onChange={this.onChange}
                                            selectCountry={this.selectCountry}
                                            selectRegion={this.selectRegion}

                                            value={this.state.inputs}
                                            notOk={this.state.notOk}
                                        />
                                    </Grid>


                                    {this.state.pokList &&
                                        <>
                                            <Grid item xs={6}>
                                                <ShBrokerSelectPanel
                                                    checked={this.state.WantCustom}
                                                    onCheckboxChange={this.onCheckboxChange}

                                                    limit={10}
                                                    label={strings.shbroker.want}
                                                    attr="Want"
                                                    pokList={this.state.pokList}
                                                    onPokemonAdd={this.onPokemonAdd}
                                                    onPokemonDelete={this.onPokemonDelete}

                                                    pokemonTable={this.props.bases.pokemonBase}
                                                    userList={this.state.Want}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <ShBrokerSelectPanel
                                                    checked={this.state.HaveCustom}
                                                    onCheckboxChange={this.onCheckboxChange}

                                                    limit={10}
                                                    label={strings.shbroker.have}
                                                    attr="Have"
                                                    pokList={this.state.pokList}
                                                    onPokemonAdd={this.onPokemonAdd}
                                                    onPokemonDelete={this.onPokemonDelete}

                                                    pokemonTable={this.props.bases.pokemonBase}
                                                    userList={this.state.Have}
                                                />
                                            </Grid>
                                        </>}

                                    <Grid item xs="auto">
                                        <Button
                                            loading={this.state.submitting}
                                            title={this.state.ok ? "Ok" : strings.shbroker.find}
                                            onClick={this.onSubmitFilter}
                                            endIcon={<SearchIcon />}
                                            disabled={Object.values(this.state.notOk).reduce((sum, val) => sum || (val !== ""), false)}
                                        />
                                    </Grid>
                                </>}

                            {(!!this.state.submittingError || !!this.state.error) &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">
                                        {!!this.state.submittingError ? this.state.submittingError : this.state.error}
                                    </Alert >
                                </Grid>}


                            {!this.state.submittingError && !this.state.submitting && !!this.props.bases.pokemonBase && this.state.selectedUsers.length > 0 &&
                                <Grid item xs={12}>
                                    <SelectedUsers
                                        list={this.state.selectedUsers}
                                        pokemonTable={this.props.bases.pokemonBase}
                                    />
                                </Grid>}

                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        getPokemonBase: () => dispatch(getPokemonBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(ShinyBroker)






