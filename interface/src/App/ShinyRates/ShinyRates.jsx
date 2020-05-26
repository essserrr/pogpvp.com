import React from "react";
import { Helmet } from "react-helmet";
import BarLoader from "react-spinners/BarLoader";
import LocalizedStrings from 'react-localization';

import Errors from "../PvP/components/Errors/Errors"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import ShinyTable from "./ShinyTable"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"


let strings = new LocalizedStrings(locale);

class ShinyRates extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            active: {
                0: true,
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
        var reason = ""
        var response = await fetch(((process.env.REACT_APP_LOCALHOST) ? process.env.REACT_APP_LOCALHOST : "") + "/db/shiny", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip',
            },
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(reason)
            });
            return
        }

        var result = await response.json()
        if (!response.ok) {
            this.setState({
                error: result.detail,
                showResult: false,
                loading: false,
                isError: true,
            });
            return;
        }

        let list = parseShinyRates(result)
        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            shinyRates: list,
            pokList: list,
        });
    }

    onClick(event) {
        var fieldName = event.currentTarget.getAttribute('name')
        var fieldType = event.currentTarget.getAttribute('colType')
        switch (this.state.active[fieldName]) {
            case true:
                this.setState({
                    active: { [fieldName]: false },
                    shinyRates: this.state.shinyRates.reverse(),
                });
                break
            default:
                this.setState({
                    active: { [fieldName]: true },
                    shinyRates: fieldType === "number" ?
                        this.state.shinyRates.sort(function (a, b) {
                            return a.props.children[fieldName].key - b.props.children[fieldName].key
                        }) :
                        this.state.shinyRates.sort(function (a, b) {
                            if (a.props.children[fieldName].key < b.props.children[fieldName].key) {
                                return -1;
                            }
                            if (b.props.children[fieldName].key < a.props.children[fieldName].key) {
                                return 1;
                            }
                            return 0;
                        }),
                });
                break
        }
    }

    onChange(event) {
        var newArray = []
        for (var i = 0; i < this.state.pokList.length; i++) {
            if (this.state.pokList[i].key.toLowerCase().indexOf(event.target.value) > -1) {
                newArray.push(this.state.pokList[i])
            }
        }

        this.setState({
            name: event.value,
            shinyRates: newArray,
        });
    }




    render() {
        return (
            <>
                <Helmet>
                    <title>{strings.pageheaders.shiny}</title>
                    <meta name="title" content={strings.pageheaders.shiny} />
                    <meta name="description" content={strings.pagedescriptions.shiny} />

                    <meta property="og:title" content={strings.pageheaders.shiny} />
                    <meta property="og:description" content={strings.pagedescriptions.shiny} />

                    <meta property="twitter:title" content={strings.pageheaders.shiny} />
                    <meta property="twitter:description" content={strings.pagedescriptions.shiny} />
                </Helmet>
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-2 pb-2">
                        <div className="singleNews  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading && <div className="row  justify-content-center"  >
                                <div style={{ fontWeight: "500", color: "black" }} >
                                    {strings.tips.loading}
                                    <BarLoader
                                        color={"black"}
                                        loading={this.state.loading}
                                    />
                                </div>
                            </div>}
                            {this.state.showResult && <ShinyTable
                                onClick={this.onClick}
                                onChange={this.onChange}
                                firstColumn={this.state.active[0]}
                                secondColumn={this.state.active[1]}
                                thirdColumn={this.state.active[2]}
                                fourthColumn={this.state.active[3]}

                                body={this.state.shinyRates}
                            />
                            }
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default ShinyRates

//generator functions
function parseShinyRates(list) {
    let result = []
    const values = Object.values(list)

    for (var i = 0; i < values.length; i++) {
        result.push(
            <tr className="animShiny" key={values[i].Name}>
                <th className="text-center text-sm-left px-0" key={values[i].Name} scope="row">
                    <PokemonIconer withSuffix={"-shiny"} src={values[i].Name} class={"icon24 p-0 m-0 mr-1 "} />{values[i].Name}
                </th>
                <td className="px-0" key={values[i].Odds}>{"1/" + values[i].Odds + " (" + (1 / values[i].Odds * 100).toFixed(2) + "%)"}</td>
                <td className="px-0" key={values[i].Odds + "est"}>{"1/" + processRate(values[i].Odds)}</td>
                <td className="px-0" key={values[i].Checks}>{values[i].Checks}</td>
            </tr>
        )
    }
    return result
}


function processRate(chance) {
    for (let i = ratesList.length - 1; i >= 0; i--) {
        if (chance === ratesList[i]) {
            return ratesList[i]
        }
        if (chance < ratesList[i]) {
            continue
        }

        if (!ratesList[i + 1]) {
            return ratesList[i]
        }
        let deltaLeft = chance - ratesList[i]
        let deltaRight = ratesList[i + 1] - chance
        switch (true) {
            case deltaLeft > deltaRight:
                return ratesList[i + 1]
            case deltaLeft < deltaRight:
                return ratesList[i]
            default:
                return ratesList[i + 1]
        }
    }
    return ratesList[0]
}

var ratesList = [
    24,
    60,
    90,
    120,
    240,
    450,
    800,
]