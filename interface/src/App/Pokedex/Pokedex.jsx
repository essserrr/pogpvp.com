import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';

import Errors from "../PvP/components/Errors/Errors"
import PokeRow from "./PokeRow/PokeRow"
import TableThead from "./TableThead/TableThead"
import Loader from "../PvpRating/Loader"

import { dexLocale } from "../../locale/dexLocale"
import { getCookie, culculateCP } from "../../js/indexFunctions"


let strings = new LocalizedStrings(dexLocale);

class Movedex extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            active: {
                Title: false,
            },

            showLegend: false,
            showResult: false,
            isError: false,
            error: "",
            loading: false,
        };
        this.onShowLegend = this.onShowLegend.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSort = this.onSort.bind(this)
    }


    async componentDidMount() {
        this.setState({
            loading: true,
        })
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
        ];
        var reason = ""
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

        let arr = []
        for (const [key, value] of Object.entries(results[0])) {
            value.Generation = Number(value.Generation)
            value.Number = Number(value.Number)
            value.CP = culculateCP(value.Title, 40, 15, 15, 15, results[0])
            arr.push(
                <PokeRow
                    key={key}
                    value={value}
                />)
        }

        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            moveTable: results[0],
            originalList: arr,
        });

        const step = 100
        this.recursive((step < arr.length ? step : arr.length), arr)

    }


    recursive = (end, original) => {
        const step = 100
        setTimeout(() => {
            let nextPortion = end + step < original.length ? end + step : original.length;
            let isNext = end < original.length

            this.setState({
                blockSort: isNext,
                listToShow: original.slice(0, end)
            });

            if (isNext) {
                this.recursive(nextPortion, original)
            }
        }, 0);
    }



    onChange(event) {
        if (this.state.blockSort) {
            return
        }
        let newArray = this.state.originalList.filter(e => e.key.key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
        this.setState({
            name: event.value,
            listToShow: newArray,
        });
    }


    onShowLegend() {
        this.setState({
            showLegend: !this.state.showLegend
        })
    }

    onSort(event) {
        if (this.state.blockSort) {
            return
        }
        var fieldName = event.currentTarget.getAttribute('name')
        var fieldType = event.currentTarget.getAttribute('coltype')
        switch (this.state.active[fieldName]) {
            case true:
                this.setState({
                    active: { [fieldName]: false },
                    shinyRates: this.state.listToShow.reverse(),
                });
                break
            default:
                this.setState({
                    active: { [fieldName]: true },
                    listToShow: fieldType === "number" ? this.sortNumber(fieldName) :
                        (fieldType === "type" ? this.sortTypeArr(fieldName) :
                            this.sortString(fieldName)),
                });
                break
        }
    }

    sortNumber(fieldName) {
        return this.state.listToShow.sort(function (a, b) {
            return b.props.value[fieldName] - a.props.value[fieldName]
        })
    }

    sortString(fieldName) {
        return this.state.listToShow.sort(function (a, b) {
            if (a.props.value[fieldName] > b.props.value[fieldName]) {
                return -1;
            }
            if (b.props.value[fieldName] > a.props.value[fieldName]) {
                return 1;
            }
            return 0;
        })
    }

    sortTypeArr(fieldName) {
        return this.state.listToShow.sort(function (a, b) {
            if (b.props.value[fieldName][0] === a.props.value[fieldName][0]) {
                if (b.props.value[fieldName].length > 1 && a.props.value[fieldName].length > 1) {
                    return b.props.value[fieldName][1] - a.props.value[fieldName][1];
                }
                if (b.props.value[fieldName].length > 1) {
                    return 1
                }
                return -1
            }
            return b.props.value[fieldName][0] - a.props.value[fieldName][0];
        })
    }



    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/pokedex"
                    header={strings.pdtitle}
                    descr={strings.pddescr}
                />
                <div className="container-fluid mt-3 mb-5">
                    <div className=" row justify-content-center px-1 px-sm-2 pb-2">
                        <div className="singleNews col-12  col-md-10 col-lg-8 p-1 p-sm-2 p-md-4">
                            {this.state.loading &&
                                <Loader
                                    color="black"
                                    weight="500"
                                    locale={strings.loading}
                                    loading={this.state.loading}
                                />}
                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                            {this.state.showResult &&
                                <>
                                    <input onChange={this.onChange} className="form-control" type="text"
                                        placeholder={strings.pokplace} />
                                    <table className="table mb-0 table-sm text-center">
                                        <TableThead
                                            active={this.state.active}
                                            onClick={this.onSort}
                                        />
                                        <tbody>
                                            {this.state.listToShow}
                                        </tbody>
                                    </table>
                                </>}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default Movedex

