import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import SiteHelm from "../../SiteHelm/SiteHelm"
import ShBrokerForm from "./ShBrokerForm/ShBrokerForm"
import Errors from "../../PvP/components/Errors/Errors"
import Loader from "../../PvpRating/Loader"
import ShBrokerSelectPanel from "./ShBrokerSelectPanel/ShBrokerSelectPanel"
import AuthButton from "../../Registration/RegForm/AuthButton/AuthButton"

import { refresh } from "../../../AppStore/Actions/refresh"
import { getPokemonBase } from "../../../AppStore/Actions/getPokemonBase"
import { getCookie } from "../../../js/getCookie"
import { userLocale } from "../../../locale/userLocale"

import "./UserShinyBroker.scss"

let strings = new LocalizedStrings(userLocale);


class UserShinyBroker extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

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
        return Object.entries(pokBase).map((value) => ({ value: value[0], label: <div style={{ textAlign: "left" }}>{value[0]}</div>, }))
    }


    selectCountry(val) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                Country: val.value,
                Region: ""
            },
            notOk: {
                ...this.state.notOk,
                Country: this.check(val, "Country"),
            }

        });
    }

    selectRegion(val) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                Region: val.value,
            },
            notOk: {
                ...this.state.notOk,
                Region: this.check(val, "Region"),
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
        if (str.length < 1) { return strings.shbroker.err.c1 + strings.err.longer.l1 + "1" + strings.err.lesseq.c }
        if (str.length > 36) { return strings.shbroker.err.c1 + strings.err.lesseq.l1 + "36" + strings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.c1 + strings.err.symb2 }
        if (!str.replace(/\s/g, '').length) { return strings.moveconstr.err.wrong + strings.shbroker.err.c2 }
        return ""
    }

    checkContacts(str) {
        if (str.length < 1) { return strings.shbroker.err.cd1 + strings.err.longer.l3 + "1" + strings.err.lesseq.c }
        if (str.length > 150) { return strings.shbroker.err.cd1 + strings.err.lesseq.l3 + "150" + strings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.cd1 + strings.err.symb2 }
        if (!str.replace(/\s/g, '').length) { return strings.moveconstr.err.wrong + strings.shbroker.err.cd2 }
        return ""
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.,!():$%^&*+= ]*)$")
    }

    onPokemonAdd(event, args) {
        if (Object.keys(this.state[args.name[0]]).length > 400) { return }

        this.setState({
            [args.name[0]]: {
                ...this.state[args.name[0]],
                [event.value]: { Name: event.value, Type: "Shiny", Amount: this.state.inputs[args.name[0] + "Amount"], },
            }
        })
    }

    onPokemonDelete(event) {
        let attr = event.target.getAttribute("attr")
        let index = event.target.getAttribute("index")

        let updatedObj = { ...this.state[attr] }
        delete updatedObj[index]

        this.setState({
            [attr]: updatedObj,
        })
    }

    onAmountChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            inputs: {
                ...this.state.inputs,
                [attr + event.target.name]: event.target.value,
            },
        })
    }

    validate() {
        let notOk = {}
        for (const [key, value] of Object.entries(this.state.inputs)) {
            notOk[key] = this.check(value, key)
        }

        this.setState({ notOk: notOk, })
        return !Object.values(notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)
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
            await new Promise(res => setTimeout(res, 2500));
            this.setState({ ok: false })
        } catch (e) {
            this.setState({
                submitting: false,
                error: String(e),
            });
        }
    }

    onTurnOnImport(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        let role = event.target.getAttribute("attr")
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
        let importedList = str.split(",")

        let idBase = {}

        // eslint-disable-next-line
        for (const [key, value] of Object.entries(this.props.bases.pokemonBase)) {
            idBase[value.Number + (value.Forme ? "-" + value.Forme : "")] = value
        }

        return importedList.filter((value) => !!idBase[value]).map((value) => {
            return { Name: idBase[value].Title, Type: "Shiny", Amount: 1 }
        })
    }

    render() {
        return (
            <div className="col pt-2 px-2">
                <SiteHelm
                    url="https://pogpvp.com/profile/shinybroker"
                    header={strings.pageheaders.usrbroker}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                <div className="row mx-0 justify-content-center" >
                    {this.state.loading &&
                        <Loader
                            color="black"
                            weight="500"
                            locale={strings.loading}
                            loading={this.state.loading}
                        />}
                    {!this.state.loading &&
                        <>
                            <div className="user-shinybroker__title col-12 pt-2 text-center">{strings.upage.shbr}</div>
                            <div className="col-12 pt-3">
                                <ShBrokerForm
                                    placeholders={{
                                        cPlace: strings.shbroker.cPlaceYours, rPlace: strings.shbroker.rPlaceYours,
                                        cityPlace: strings.shbroker.cityPlaceYours, contPlace: strings.shbroker.contPlaceYours
                                    }}


                                    onChange={this.onChange}
                                    selectCountry={this.selectCountry}
                                    selectRegion={this.selectRegion}

                                    value={this.state.inputs}
                                    notOk={this.state.notOk}
                                />
                            </div>
                        </>}
                    {this.state.pokList && <div className="col-6 py-2">
                        <ShBrokerSelectPanel
                            limit={400}
                            label={strings.shbroker.have}
                            attr="Have"

                            onImport={this.onImport}
                            onTurnOnImport={this.onTurnOnImport}
                            showImportExportPanel={this.state.HaveImport}


                            pokList={this.state.pokList}
                            onPokemonAdd={this.onPokemonAdd}
                            onPokemonDelete={this.onPokemonDelete}
                            onAmountChange={this.onAmountChange}

                            pokemonTable={this.props.bases.pokemonBase}
                            userList={this.state.Have}
                        />
                    </div>}
                    {this.state.pokList && <div className="col-6 py-2">
                        <ShBrokerSelectPanel
                            limit={400}
                            label={strings.shbroker.want}
                            attr="Want"

                            onImport={this.onImport}
                            onTurnOnImport={this.onTurnOnImport}
                            showImportExportPanel={this.state.WantImport}

                            pokList={this.state.pokList}
                            onPokemonAdd={this.onPokemonAdd}
                            onPokemonDelete={this.onPokemonDelete}
                            onAmountChange={this.onAmountChange}

                            pokemonTable={this.props.bases.pokemonBase}
                            userList={this.state.Want}
                        />
                    </div>}

                    {this.state.pokList && <div className="col-12 px-1">
                        <div className="row m-0 py-2 mb-2 justify-content-center">
                            <AuthButton
                                loading={this.state.submitting}
                                title={this.state.ok ? "Ok" : strings.moveconstr.changes}
                                onClick={this.onSaveChanges}
                                disabled={Object.values(this.state.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)}
                            />
                        </div>
                    </div>}

                    {!!this.state.error &&
                        <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                            <Errors class="alert alert-danger p-2" value={this.state.error} />
                        </div>}
                </div>
            </div>
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