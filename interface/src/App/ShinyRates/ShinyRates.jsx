import React from "react";
import { Helmet } from "react-helmet";
import LocalizedStrings from 'react-localization';

import Errors from "../PvP/components/Errors/Errors"
import ShinyTable from "./ShinyTable"
import Loader from "../PvpRating/Loader"
import ShinyTableTr from "./ShinyTableTr"

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
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/shiny", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            //after opening the page get pokemonBase
        ];
        var responses = await Promise.all(fetches).catch(function (r) {
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

        let parses = [
            responses[0].json(),
            responses[1].json(),
        ]
        var results = await Promise.all(parses)

        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                this.setState({
                    error: results[i].detail,
                    showResult: false,
                    loading: false,
                    isError: true,
                });
                return;
            }
        }

        let list = parseShinyRates(results[1], results[0])
        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            pokTable: results[0],
            shinyRates: list,
            pokList: list,
        });
    }

    onClick(event) {
        var fieldName = event.currentTarget.getAttribute('name')
        var fieldType = event.currentTarget.getAttribute('coltype')
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
                            return a.props.children[fieldName].props.value - b.props.children[fieldName].props.value
                        }) :
                        this.state.shinyRates.sort(function (a, b) {
                            if (a.props.children[fieldName].props.value < b.props.children[fieldName].props.value) {
                                return -1;
                            }
                            if (b.props.children[fieldName].props.value < a.props.children[fieldName].props.value) {
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
            if (this.state.pokList[i].key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
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
                    <link rel="canonical" href="https://pogpvp.com/shinyrates" />

                    <title>{strings.pageheaders.shiny}</title>
                    <meta name="description" content={strings.pagedescriptions.shiny} />

                    <meta property="og:title" content={strings.pageheaders.shiny} />
                    <meta property="og:url" content="https://pogpvp.com/shinyrates"></meta>
                    <meta property="og:description" content={strings.pagedescriptions.shiny} />

                    <meta property="twitter:title" content={strings.pageheaders.shiny} />
                    <meta property="twitter:url" content="https://pogpvp.com/shinyrates"></meta>
                    <meta property="twitter:description" content={strings.pagedescriptions.shiny} />
                </Helmet>
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.tips.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
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
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default ShinyRates

//generator functions
function parseShinyRates(list, pokTable) {
    let result = []
    const values = Object.values(list)
    for (var i = 0; i < values.length; i++) {
        result.push(
            <ShinyTableTr
                key={values[i].Name}
                pok={values[i]}
                pokTable={pokTable}
            />
        )
    }
    return result
}


