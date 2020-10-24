import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';

import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import ShinyTableFilter from "./ShinyTableFilter/ShinyTableFilter"
import Loader from "../PvpRating/Loader"
import SiteHelm from "../SiteHelm/SiteHelm"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/getCookie"

import "./ShinyRates.scss"

let strings = new LocalizedStrings(locale);

class ShinyRates extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            active: {
                field: "Name",
                type: "string",
                order: true,
            },

            name: "",
            shinyRates: [],
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        try {
            let fetches = [
                this.props.getPokemonBase(),
                fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/shiny", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }),
            ]

            let responses = await Promise.all(fetches)
            let result = await responses[1].json()

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i === 1 ? result.detail : responses[i].detail) }
            }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                shinyRates: result,
            })
        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e)
            })
        }

    }

    onClick(event) {
        let fieldName = event.currentTarget.getAttribute("name")
        let fieldType = event.currentTarget.getAttribute("coltype")

        this.setState({
            active: {
                field: fieldName,
                type: fieldType,
                order: this.state.active.field === fieldName ? !this.state.active.order : true
            },
        });
    }

    onChange(event) {
        this.setState({
            name: event.target.value,
        });
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/shinyrates"
                    header={strings.pageheaders.shiny}
                    descr={strings.pagedescriptions.shiny}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className="row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="shiny-rates col-12 col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}
                            <Alert variant="filled" severity="error">{"Function will be depricated soon."}</Alert >
                            {this.state.isError && <Alert variant="filled" severity="error">{this.state.error}</Alert >}
                            {this.state.showResult &&
                                <ShinyTableFilter
                                    list={this.state.shinyRates}
                                    value={this.state.name}
                                    filter={this.state.active}

                                    onClick={this.onClick}
                                    onChange={this.onChange}
                                    firstColumn={this.state.active.field === "Name"}
                                    secondColumn={this.state.active.field === "Odds"}
                                    thirdColumn={this.state.active.field === "Odds"}
                                    fourthColumn={this.state.active.field === "Checks"}

                                    pokTable={this.props.bases.pokemonBase}
                                />}
                        </div>
                    </div>
                </div >
            </>
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
)(ShinyRates)



