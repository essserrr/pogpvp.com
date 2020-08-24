import React from "react"
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import { refresh } from "../../AppStore/Actions/refresh"
import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import Errors from "../PvP/components/Errors/Errors"
import Loader from "../PvpRating/Loader"
import ShBrokerForm from "../Userpage/Shbroker/ShBrokerForm/ShBrokerForm"
import AuthButton from "../Registration/RegForm/AuthButton/AuthButton"
import SelectedUsers from "./SelectedUsers/SelectedUsers"

import { getCookie } from "../../js/getCookie"
import { userLocale } from "../../locale/userLocale"


let strings = new LocalizedStrings(userLocale);

class ShinyBroker extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: {
                Country: "Russian Federation", Region: "", City: "", Contacts: "",
            },

            notOk: {
                Country: "", Region: "", City: "", Contacts: "",
            },
            Have: "",
            Want: "",

            selectedUsers: [],

            loading: false,
            error: "",
            ok: false,
            submitting: false,
        };

        this.selectCountry = this.selectCountry.bind(this)
        this.selectRegion = this.selectRegion.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmitFilter = this.onSubmitFilter.bind(this)
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })
        //get pok and eggs db
        try {
            let fetches = [this.props.getPokemonBase(),]
            let responses = await Promise.all(fetches)

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw this.props.bases.error }
            }

            this.setState({ loading: false, error: "", })
        } catch (e) {
            this.setState({ loading: false, error: String(e) })
        }
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
        console.log(val)
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

    checkSelect(str, name) {
        if (name === "Country" && str === "") { return strings.shbroker.cPlace }
        return ""
    }

    checkCity(str) {
        if (str.length < 0) { return strings.shbroker.err.c1 + strings.err.longer.l1 + "0" + strings.err.lesseq.c }
        if (str.length > 36) { return strings.shbroker.err.c1 + strings.err.lesseq.l1 + "36" + strings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.c1 + strings.err.symb2 }
        if (!str.replace(/\s/g, '').length && str !== "") { return strings.moveconstr.err.wrong + strings.shbroker.err.c2 }
        return ""
    }

    checkContacts(str) {
        if (str.length < 0) { return strings.shbroker.err.cd1 + strings.err.longer.l3 + "0" + strings.err.lesseq.c }
        if (str.length > 150) { return strings.shbroker.err.cd1 + strings.err.lesseq.l3 + "150" + strings.err.lesseq.c }
        if (this.checkRegexp(str)) { return strings.shbroker.err.cd1 + strings.err.symb2 }
        if (!str.replace(/\s/g, '').length && str !== "") { return strings.moveconstr.err.wrong + strings.shbroker.err.cd2 }
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
                    notOk[key] = ""

            }
        }

        this.setState({ notOk: notOk, })
        return !Object.values(notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)
    }

    async onSubmitFilter() {
        this.setState({
            submitting: true, error: "", ok: false,
        })
        if (!this.validate()) {
            this.setState({ submitting: false, })
            return
        }
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
                    })
            })
            //parse answer
            const data = await response.json();
            //if response is not ok, handle error
            if (!response.ok) {
                throw data.detail
            }

            //show ok
            this.setState({ submitting: false, ok: true, selectedUsers: data })
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
            <>
                <SiteHelm
                    url="https://pogpvp.com/eggs"
                    header={strings.pageheaders.eggs}
                    descr={strings.pagedescriptions.eggs}
                />
                <div className=" container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews max1200-1 col-sm-12 col-md-11 col-lg-10 col-xl-8 mx-0 py-2">
                            <div className=" row justify-content-center">

                                {this.state.loading &&
                                    <div className="col-12 px-1">
                                        <Loader
                                            color="black"
                                            weight="500"
                                            locale={strings.loading}
                                            loading={this.state.loading}
                                        /></div>}

                                {!this.state.loading && !this.state.error && <div className="col-12 pt-3">
                                    <ShBrokerForm
                                        onChange={this.onChange}
                                        selectCountry={this.selectCountry}
                                        selectRegion={this.selectRegion}

                                        value={this.state.inputs}
                                        notOk={this.state.notOk}
                                    />
                                    <div className="col-12 px-1">
                                        <div className="row m-0 py-3 justify-content-center">
                                            <AuthButton
                                                loading={this.state.submitting}
                                                title={this.state.ok ? "Ok" : strings.shbroker.find}
                                                onClick={this.onSubmitFilter}
                                                disabled={Object.values(this.state.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)}
                                            />
                                        </div>
                                    </div>
                                </div>}
                                {!!this.state.error &&
                                    <div className="col-12 col-md-10 col-lg-9 px-0">
                                        <Errors class="alert alert-danger p-2" value={this.state.error} />
                                    </div>}
                                {!this.state.error && !!this.props.bases.pokemonBase && !!this.state.selectedUsers && <SelectedUsers
                                    list={this.state.selectedUsers}
                                    pokemonTable={this.props.bases.pokemonBase}
                                />}

                            </div>
                        </div>
                    </div>
                </div >
            </>
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






