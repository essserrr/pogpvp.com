import React from "react";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';

import UserPageContent from "App/Userpage/UserPageContent/UserPageContent";
import SiteHelm from "App/SiteHelm/SiteHelm";
import ShBrokerForm from "./ShBrokerForm/ShBrokerForm";
import ShBrokerSelectPanel from "./ShBrokerSelectPanel/ShBrokerSelectPanel";
import Button from "App/Components/Button/Button";
import SaveIcon from '@material-ui/icons/Save';

import { shinyDict } from "./ShinyDict";
import { refresh } from "AppStore/Actions/refresh";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import { getCookie } from "js/getCookie";
import { shinyBroker } from "locale/UserPage/ShinyBroker/ShinyBroker";
import { errors } from "locale/UserPage/Errors";

let strings = new LocalizedStrings(shinyBroker);
let errorStrings = new LocalizedStrings(errors);

class UserShinyBroker extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        errorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: {
                Country: "", Region: "", City: "", Contacts: "", HaveAmount: "1", WantAmount: "1",
            },

            notOk: {
                Country: "", Region: "", City: "", Contacts: "",
            },
            pokList: null,

            Have: {},
            HaveImport: false,
            Want: {},
            WantImport: false,

            loading: false,
            error: "",
            ok: false,
            submitting: false,
        }

        this.selectCountry = this.selectCountry.bind(this)
        this.selectRegion = this.selectRegion.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onPokemonAdd = this.onPokemonAdd.bind(this)
        this.onPokemonDelete = this.onPokemonDelete.bind(this)
        this.onAmountChange = this.onAmountChange.bind(this)
        this.onSaveChanges = this.onSaveChanges.bind(this)
        this.onTurnOnImport = this.onTurnOnImport.bind(this)
        this.onImport = this.onImport.bind(this)
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })

        await this.props.refresh()
        try {
            let fetches = [
                this.props.getPokemonBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/getbroker", {
                    method: "GET",
                    credentials: "include",
                })
            ]

            let responses = await Promise.all(fetches)

            let userBroker = await responses[1].json()

            //if response is not ok, handle error
            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 1 ? userBroker.detail : this.props.bases.error) }
            }

            this.setState({
                loading: false,
                error: "",
                pokList: this.returnPokList(this.props.bases.pokemonBase),

                inputs: {
                    ...this.state.inputs,
                    Country: userBroker.Country,
                    Region: userBroker.Region,
                    City: userBroker.City,
                    Contacts: userBroker.Contacts,
                },


                Have: !!userBroker.Have ? userBroker.Have : {},
                Want: !!userBroker.Want ? userBroker.Want : {},
            })

        } catch (e) {
            this.setState({
                loading: false,
                error: String(e)
            })
        }
    }

    returnPokList(pokBase) {
        return Object.entries(pokBase).map((value) => ({ value: value[0], title: value[0], }))
    }


    selectCountry(event, attributes, eventItem) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                Country: eventItem.value,
                Region: ""
            },
            notOk: {
                ...this.state.notOk,
                Country: this.check(eventItem.value, "Country"),
            }

        });
    }

    selectRegion(event, attributes, eventItem) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                Region: eventItem.value,
            },
            notOk: {
                ...this.state.notOk,
                Region: this.check(eventItem.value, "Region"),
            }
        });
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
        if (str === "") { return name === "Region" ? strings.shbroker.rPlaceYours : strings.shbroker.cPlaceYours }
        return ""
    }

    checkCity(str) {
        if (str.length < 1) { return strings.shbroker.err.c1 + errorStrings.err.longer.l1 + "1" + errorStrings.err.lesseq.c }
        if (str.length > 36) { return strings.shbroker.err.c1 + errorStrings.err.lesseq.l1 + "36" + errorStrings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.c1 + errorStrings.err.symb2 }
        if (!str.replace(/\s/g, '').length) { return strings.shbroker.err.wrong + strings.shbroker.err.c2 }
        return ""
    }

    checkContacts(str) {
        if (str.length < 1) { return strings.shbroker.err.cd1 + errorStrings.err.longer.l3 + "1" + errorStrings.err.lesseq.c }
        if (str.length > 150) { return strings.shbroker.err.cd1 + errorStrings.err.lesseq.l3 + "150" + errorStrings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.cd1 + errorStrings.err.symb2 }
        if (!str.replace(/\s/g, '').length) { return strings.shbroker.err.wrong + strings.shbroker.err.cd2 }
        return ""
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.,!():$%^&*+= ]*)$")
    }

    onPokemonAdd(event, attributes, eventItem) {
        if (Object.keys(this.state[attributes.attr]).length >= 400) { return }
        this.setState({
            [attributes.attr]: {
                ...this.state[attributes.attr],
                [eventItem.value]: {
                    Name: eventItem.value,
                    Type: "Shiny",
                    Amount: this.state.inputs[attributes.attr + "Amount"],
                },
            }
        })
    }

    onPokemonDelete(attributes) {
        let updatedObj = { ...this.state[attributes.attr] }
        delete updatedObj[attributes.index]

        this.setState({
            [attributes.attr]: updatedObj,
        })
    }

    onAmountChange(event, attributes) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [attributes.attr + event.target.name]: event.target.value,
            },
        })
    }

    validate() {
        let notOk = {}
        for (const [key, value] of Object.entries(this.state.inputs)) {
            notOk[key] = this.check(value, key)
        }

        this.setState({ notOk: notOk, })
        return !Object.values(notOk).reduce((sum, val) => sum || (val !== ""), false)
    }

    async onSaveChanges() {
        this.setState({
            submitting: true, error: "", ok: false,
        })
        if (!this.validate()) {
            this.setState({ submitting: false, })
            return
        }
        try {
            await this.props.refresh()
            const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/setbroker", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(
                    {
                        Country: this.state.inputs.Country, Region: this.state.inputs.Region, City: this.state.inputs.City, Contacts: this.state.inputs.Contacts,
                        Have: this.state.Have,
                        Want: this.state.Want,
                    })
            })
            //parse answer
            const data = await response.json();
            //if response is not ok, handle error
            if (!response.ok) {
                throw data.detail
            }
            //show ok
            this.setState({ submitting: false, ok: true, })
            await new Promise(res => setTimeout(res, 4000));
            this.setState({ ok: false })
        } catch (e) {
            this.setState({
                submitting: false,
                error: String(e),
            });
        }
    }

    onTurnOnImport(event, attributes) {
        let role = attributes ? attributes.attr : event.currentTarget.getAttribute("attr");
        this.setState({
            [role + "Import"]: !this.state[role + "Import"]
        });
    }

    onImport(obj) {
        this.setState({
            [obj.attr + "Import"]: !this.state[obj.attr + "Import"],
            [obj.attr]: this.createImportedList(obj.value)
        });
    }

    createImportedList(str) {
        //split target string
        let importedList = str.split(",")
        if (importedList.length === 0) {
            return {}
        }

        //make id base 
        let baseByID = {}
        for (const [, value] of Object.entries(this.props.bases.pokemonBase)) {
            let pokId = value.Number + (value.Forme ? `-${value.Forme}` : "")
            if (!!shinyDict[pokId]) {
                //keep original value too becuse the list duplicates some formes
                baseByID[pokId] = value
                pokId = shinyDict[pokId]
            }
            baseByID[pokId] = value
        }

        //make object from the list:
        let importedPokemon = {}
        //filter list
        importedList = importedList.filter((value) => {
            switch (!baseByID[value]) {
                case true:
                    console.log(`Critical ID "${value}" not found`)
                    return false
                default:
                    return true
            }
        })
        //crop list
        if (importedList.length > 400) {
            importedList = importedList.slice(0, 400)
        }
        //make object
        importedList.forEach((value) => {
            importedPokemon[baseByID[value].Title] = { Name: baseByID[value].Title, Type: "Shiny", Amount: "1" }
        })

        return importedPokemon



    }

    render() {
        return (
            <Grid container justify="center" spacing={2}>
                <SiteHelm
                    url="https://pogpvp.com/profile/shinybroker"
                    header={strings.pageheaders.usrbroker}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />

                {this.state.loading &&
                    <Grid item xs={12}>
                        <LinearProgress color="secondary" />
                    </ Grid>}




                {!this.state.loading && this.state.pokList &&
                    <UserPageContent title={strings.shbr}>
                        <Grid container justify="center" spacing={2}>
                            <Grid item xs={12}>
                                <ShBrokerForm
                                    onChange={this.onChange}
                                    selectCountry={this.selectCountry}
                                    selectRegion={this.selectRegion}

                                    value={this.state.inputs}
                                    notOk={this.state.notOk}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ShBrokerSelectPanel
                                    limit={400}
                                    label={strings.shbroker.have}
                                    attr="Have"

                                    onImport={this.onImport}
                                    onTurnOnImport={this.onTurnOnImport}
                                    showImportExportPanel={this.state.HaveImport}

                                    Amount={this.state.inputs.HaveAmount}

                                    pokList={this.state.pokList}
                                    onPokemonAdd={this.onPokemonAdd}
                                    onPokemonDelete={this.onPokemonDelete}
                                    onAmountChange={this.onAmountChange}

                                    pokemonTable={this.props.bases.pokemonBase}
                                    userList={this.state.Have}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ShBrokerSelectPanel
                                    limit={400}
                                    label={strings.shbroker.want}
                                    attr="Want"

                                    onImport={this.onImport}
                                    onTurnOnImport={this.onTurnOnImport}
                                    showImportExportPanel={this.state.WantImport}

                                    Amount={this.state.inputs.WantAmount}

                                    pokList={this.state.pokList}
                                    onPokemonAdd={this.onPokemonAdd}
                                    onPokemonDelete={this.onPokemonDelete}
                                    onAmountChange={this.onAmountChange}

                                    pokemonTable={this.props.bases.pokemonBase}
                                    userList={this.state.Want}
                                />
                            </Grid>
                        </Grid>
                    </UserPageContent>}


                {!this.state.loading && this.state.pokList &&
                    <Grid item container xs={12} justify="center">
                        <Box pt={3}>
                            <Button
                                loading={this.state.submitting}
                                title={strings.shbroker.changes}
                                endIcon={<SaveIcon />}
                                onClick={this.onSaveChanges}
                                disabled={Object.values(this.state.notOk).reduce((sum, val) => sum || (val !== ""), false)}
                            />
                        </Box>
                    </Grid>}


                {!!this.state.error &&
                    <Grid item xs={12} md={10} lg={9} >
                        <Box pt={3}>
                            <Alert variant="filled" severity="error">{this.state.error}</Alert >
                        </Box>
                    </Grid>}

                <Snackbar open={this.state.ok} onClose={() => { this.setState({ ok: false }) }}>
                    <Alert variant="filled" severity="success">{strings.success}</Alert >
                </Snackbar>

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
)(UserShinyBroker)