import React from "react";
import LocalizedStrings from 'react-localization';

import Errors from "../PvP/components/Errors/Errors"
import ShinyTable from "./ShinyTable"
import Loader from "../PvpRating/Loader"
import ShinyTableTr from "./ShinyTableTr"
import SiteHelm from "../SiteHelm/SiteHelm"

import { locale } from "../../locale/locale"
import { getCookie } from "../../js/indexFunctions"


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
        let reason = ""
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
        let responses = await Promise.all(fetches).catch(function (r) {
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
        let results = await Promise.all(parses)

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

        let list = this.parseShinyRates(results[1], results[0])
        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            pokTable: results[0],
            shinyRates: list,
            pokList: list,
        });
    }

    //generator functions
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
        let fieldName = event.currentTarget.getAttribute('name')
        let fieldType = event.currentTarget.getAttribute('coltype')
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

export default ShinyRates




