import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"


import ShBrokerForm from "./ShBrokerForm/ShBrokerForm"
import Errors from "../../PvP/components/Errors/Errors"
import Loader from "../../PvpRating/Loader"
import ShBrokerSelectPanel from "./ShBrokerSelectPanel/ShBrokerSelectPanel"
import AuthButton from "../../Registration/RegForm/AuthButton/AuthButton"

import { refresh } from "../../../AppStore/Actions/refresh"
import { getPokemonBase } from "../../../AppStore/Actions/getPokemonBase"
import { getCookie } from "../../../js/getCookie"
import { returnPokList } from "../../../js/indexFunctions"
import { userLocale } from "../../../locale/userLocale"


let strings = new LocalizedStrings(userLocale);


class Shbroker extends React.PureComponent {
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
            Have: { Charmander: { Name: "Charmander", Type: "Shiny", Amount: "1", }, Pikachu: { Name: "Pikachu", Type: "Shiny", Amount: "1", } },
            Want: { Metwo: { Name: "Mewtwo", Type: "Shiny", Amount: "1", }, Reshiram: { Name: "Reshiram", Type: "Shiny", Amount: "1", } },

            loading: false,
            error: "",
            ok: false,
        }

        this.selectCountry = this.selectCountry.bind(this)
        this.selectRegion = this.selectRegion.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onPokemonAdd = this.onPokemonAdd.bind(this)
        this.onPokemonDelete = this.onPokemonDelete.bind(this)
        this.onAmountChange = this.onAmountChange.bind(this)
        this.onSaveChanges = this.onSaveChanges.bind(this)
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let response = await this.props.getPokemonBase()
            //if response is not ok, handle error
            if (!response.ok) { throw this.props.bases.error }

            this.setState({
                loading: false,
                error: "",
                pokList: returnPokList(this.props.bases.pokemonBase)
            })

        } catch (e) {
            this.setState({
                loading: false,
                error: String(e)
            })
        }
    }


    selectCountry(val) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                Country: val
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
                Region: val
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
        if (str === "") { return name === "Country" ? strings.shbroker.rPlace : strings.shbroker.cPlace }
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
        if (Object.keys(this.state[args.name[0]]).length >= 250) { return }

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
        let notOk = { Title: this.check(this.state.Title, "Title") }
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

    render() {
        return (
            <div className="col pt-2 px-2">
                <div className="row mx-0 justify-content-center" >
                    {this.state.loading &&
                        <Loader
                            color="black"
                            weight="500"
                            locale={strings.loading}
                            loading={this.state.loading}
                        />}
                    <div className="col-12 pt-3">
                        <ShBrokerForm
                            onChange={this.onChange}
                            selectCountry={this.selectCountry}
                            selectRegion={this.selectRegion}

                            value={this.state.inputs}
                            notOk={this.state.notOk}
                        />
                    </div>
                    {this.state.pokList && <div className="col-6 py-2">
                        <ShBrokerSelectPanel
                            label={strings.shbroker.have}
                            attr="Have"
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
                            label={strings.shbroker.want}
                            attr="Want"
                            pokList={this.state.pokList}
                            onPokemonAdd={this.onPokemonAdd}
                            onPokemonDelete={this.onPokemonDelete}
                            onAmountChange={this.onAmountChange}

                            pokemonTable={this.props.bases.pokemonBase}
                            userList={this.state.Want}
                        />
                    </div>}

                    {this.state.pokList && <div className="col-12 px-1">
                        <div className="row m-0 py-2 justify-content-center">
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
)(Shbroker)