import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"


import ShBrokerForm from "./ShBrokerForm/ShBrokerForm"
import Errors from "../../PvP/components/Errors/Errors"
import Loader from "../../PvpRating/Loader"
import ShBrokerSelectPanel from "./ShBrokerSelectPanel/ShBrokerSelectPanel"

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
                Country: "", Region: "", City: "", Contacts: "",
            },

            notOk: {
                Country: "", Region: "", City: "", Contacts: "",
            },
            pokList: null,
            Have: { Charmander: { Name: "Charmander", Type: "Shiny", Amount: 1, }, Pikachu: { Name: "Pikachu", Type: "Shiny", Amount: 1, } },
            Want: { Metwo: { Name: "Mewtwo", Type: "Shiny", Amount: 1, }, Reshiram: { Name: "Reshiram", Type: "Shiny", Amount: 1, } },

            loading: false,
            error: "",
        }

        this.selectCountry = this.selectCountry.bind(this)
        this.selectRegion = this.selectRegion.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onPokemonAdd = this.onPokemonAdd.bind(this)
        this.onPokemonDelete = this.onPokemonDelete.bind(this)
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
        this.setState({ inputs: { ...this.state.inputs, Country: val } });
    }

    selectRegion(val) {
        this.setState({ inputs: { ...this.state.inputs, Region: val } });
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
            case name === "City":
                return this.checkCity(value)
            case name === "Contacts":
                return this.checkContacts(value)
            default:
                return ""
        }
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
                [event.value]: { Name: event.value, Type: "Shiny", Amount: 1, },
            }
        })
    }

    onPokemonDelete(event) {
        let attr = event.target.getAttribute("attr")
        let index = event.target.getAttribute("index")

        let updatedObj = { ...this.state[attr] }
        delete updatedObj[index]

        console.log(updatedObj, index)

        this.setState({
            [attr]: updatedObj,
        })
    }

    render() {
        return (
            <div className="col pt-2 px-2">
                <div className="row mx-0" >
                    {this.state.loading &&
                        <Loader
                            color="black"
                            weight="500"
                            locale={strings.loading}
                            loading={this.state.loading}
                        />}
                    {!!this.state.error &&
                        <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                            <Errors class="alert alert-danger p-2" value={this.state.error} />

                        </div>}
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

                            pokemonTable={this.props.bases.pokemonBase}
                            userList={this.state.Want}
                        />
                    </div>}

                </div>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        getPokemonBase: () => dispatch(getPokemonBase()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
    }), mapDispatchToProps
)(Shbroker)