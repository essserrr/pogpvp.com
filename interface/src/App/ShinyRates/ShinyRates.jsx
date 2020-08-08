import React from "react";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux"

import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import Errors from "../PvP/components/Errors/Errors"
import ShinyTable from "./ShinyTable/ShinyTable"
import Loader from "../PvpRating/Loader"
import ShinyTableTr from "./ShinyTable/ShinyTableTr"
import SiteHelm from "../SiteHelm/SiteHelm"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/getCookie"


let strings = new LocalizedStrings(locale);

class ShinyRates extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            active: {
                field: "Name",
                type: "string",
            },

            name: "",
            pokList: [],
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
                if (!responses[i].ok) { throw (i === 1 ? result.detail : this.props.bases.error) }
            }

            let list = this.parseShinyRates(result, this.props.bases.pokemonBase)
            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                pokTable: this.props.bases.pokemonBase,
                shinyRates: list,
                pokList: list,
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

    //generator function
    parseShinyRates(list, pokTable) {
        let result = []
        for (const [key, value] of Object.entries(list)) {
            result.push(
                <ShinyTableTr
                    key={value.Name + key}
                    pok={value}
                    pokTable={pokTable}
                />
            )
        }
        return result
    }

    onClick(event) {
        let fieldName = event.currentTarget.getAttribute("name")
        let fieldType = event.currentTarget.getAttribute("coltype")
        switch (this.state.active.field === fieldName) {
            case true:
                this.setState({
                    active: {},
                    shinyRates: this.state.shinyRates.reverse(),
                });
                break
            default:
                this.setState({
                    active: {
                        field: fieldName,
                        type: fieldType,
                    },
                    shinyRates: fieldType === "number" ?
                        this.sortNumber(fieldName, this.state.shinyRates) : this.sortString(fieldName, this.state.shinyRates),
                });
                break
        }
    }


    sortNumber(fieldName, arr) {
        return arr.sort(function (a, b) {
            return a.props.pok[fieldName] - b.props.pok[fieldName]
        })
    }

    sortString(fieldName, arr) {
        return arr.sort(function (a, b) {
            if (a.props.pok[fieldName] < b.props.pok[fieldName]) {
                return -1;
            }
            if (b.props.pok[fieldName] < a.props.pok[fieldName]) {
                return 1;
            }
            return 0;
        })
    }


    onChange(event) {
        let newList = this.state.pokList.filter(e => e.key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1)
        if (this.state.active.field) {
            newList = this.state.active.type === "number" ?
                this.sortNumber(this.state.active.field, newList) : this.sortString(this.state.active.field, newList)
        }
        this.setState({
            name: event.value,
            shinyRates: newList,
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
                        <div className="singleNews max1200-1 col-12 col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}
                            <Errors class="alert alert-danger m-0 p-2 mb-2" value={"Function will be depricated soon."} />
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult && <ShinyTable
                                onClick={this.onClick}
                                onChange={this.onChange}
                                firstColumn={this.state.active.field === "Name"}
                                secondColumn={this.state.active.field === "Odds"}
                                thirdColumn={this.state.active.field === "Odds"}
                                fourthColumn={this.state.active.field === "Checks"}

                                body={this.state.shinyRates}
                            />
                            }
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



