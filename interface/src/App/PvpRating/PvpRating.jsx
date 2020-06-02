import React from "react";
import { Helmet } from "react-helmet";
import { UnmountClosed } from 'react-collapse';
import BarLoader from "react-spinners/BarLoader";
import LocalizedStrings from 'react-localization';

import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import SubmitButton from "../PvP/components/SubmitButton/SubmitButton"
import Collapsable from "./Collapsable"
import Errors from "../PvP/components/Errors/Errors"
import Type from "../PvP/components/CpAndTypes/Type"
import SelectGroup from "../PvP/components/SelectGroup/SelectGroup";
import PokemonCard from "../Evolve/PokemonCard"
import RatingDescr from "./RatingDescr"

import { ReactComponent as Shadow } from "../../icons/shadow.svg";
import { typeDecoder, checkShadow, getCookie, capitalize } from "../../js/indexFunctions"

import { locale } from "../../locale/locale"

let strings = new LocalizedStrings(locale);

class PvpRating extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            pokemonTable: [],
            moveTable: [],
            ratingList: [],
            listToShow: [],
            rawData: [],

            n: 0,
            league: "Great",
            combination: "overall",

            error: "",
            showResult: false,
            isError: false,
            loading: false,
            isNextPage: false,
            searchState: false,

            leagueList: [
                <option value="Great" key="Great">{strings.options.league.great}</option>,
                <option value="Ultra" key="ultra">{strings.options.league.ultra}</option>,
                <option value="Master" key="master">{strings.options.league.master}</option>,
                <option value="Premier" key="premier">{strings.options.league.premier}</option>,
            ],
            combinationList: [
                <option value="overall" key="overall">{strings.maximizer.overall}</option>,
                <option value="00" key="00">{strings.rating.sheilds + " 0 x 0"}</option>,
                <option value="11" key="11">{strings.rating.sheilds + " 1 x 1"}</option>,
                <option value="22" key="22">{strings.rating.sheilds + " 2 x 2"}</option>,
                <option value="01" key="01">{strings.rating.sheilds + " 0 x 1"}</option>,
                <option value="12" key="12">{strings.rating.sheilds + " 1 x 2"}</option>,
            ],

            ratingTip: [
                <small key="ratingTip">
                    {strings.rating.firstsent}
                    <br />
                    <br />
                    {strings.rating.secondsent}
                    <br />
                    <br />
                    {strings.rating.thirdsent}
                </small>
            ],
            showDescription: false,
        };
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onShowDescr = this.onShowDescr.bind(this);
    }


    async componentDidMount() {
        var defaultLeague = "Great"
        var defaultType = "overall"
        var defaultPath = "Great"

        if (this.props.match.params.league && this.props.match.params.type) {
            let propLeague = capitalize(this.props.match.params.league)
            let league = (propLeague === "Great" || propLeague === "Ultra" || propLeague === "Master") ? propLeague : undefined
            let propType = this.props.match.params.type
            let type = (propType === "overall" || propType === "00" || propType === "11"
                || propType === "22" || propType === "01" || propType === "12") ? String(propType) : undefined
            if (league && type) {
                defaultPath = league + ((type === "overall") ? "" : type)
                defaultLeague = league
                defaultType = type
            }
        }


        this.setState({
            league: defaultLeague,
            combination: defaultType,
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
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/rating/" + defaultPath, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/moves", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
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
            responses[2].json(),
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

        var ratingList = returnRatingList(results[1], results[0], results[2], this.state.league, this.state.combination)



        this.setState({
            n: 75,
            isNextPage: results[1].length - 75 > 0,


            showResult: true,
            isError: false,
            loading: false,

            pokemonTable: results[0],
            rawData: results[1],
            moveTable: results[2],


            ratingList: ratingList,
            listToShow: ratingList.slice(0, 75),
        });
    }


    onLoadMore() {
        var newN = (this.state.n + 75) <= this.state.ratingList.length ? this.state.n + 75 : this.state.ratingList.length
        this.setState({
            n: newN,
            isNextPage: this.state.ratingList.length - newN > 0,
            listToShow: this.state.ratingList.slice(0, newN),
        });
    }



    onChangeInput(event) {
        var newArray = []

        if (!event.target.value) {
            this.setState({
                searchState: false,
                listToShow: this.state.ratingList.slice(0, this.state.n),
            });
            return
        }
        for (var i = 0; i < this.state.ratingList.length; i++) {
            if (this.state.ratingList[i].key.toLowerCase().indexOf(event.target.value) > -1) {
                newArray.push(this.state.ratingList[i])
            }
        }

        this.setState({
            searchState: true,
            listToShow: newArray,
        });
    }



    async onChange(event) {
        switch (event.target.name === "league") {
            case true:
                var leaguePath = event.target.value
                var typePath = this.state.combination
                var typeOfrating = leaguePath + ((typePath === "overall") ? "" : typePath)
                break
            default:
                leaguePath = this.state.league
                typePath = event.target.value
                typeOfrating = leaguePath + ((typePath === "overall") ? "" : typePath)
                break
        }

        this.setState({
            [event.target.name]: event.target.value,
            error: "",
            showResult: false,
            isError: false,
            loading: true,
            isNextPage: false,
            searchState: false,

        });

        var reason = ""

        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/rating/" + typeOfrating, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/moves", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
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
            responses[2].json(),
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

        var ratingList = returnRatingList(results[1], results[0], results[2], this.state.league, this.state.combination)


        window.history.pushState("object or string", "Title", "/pvprating/" + leaguePath.toLowerCase() + "/" + typePath);
        this.setState({
            n: 75,
            isNextPage: results[1].length - 75 > 0,

            showResult: true,
            isError: false,
            loading: false,
            searchState: false,

            pokemonTable: results[0],
            moveTable: results[2],

            ratingList: ratingList,
            listToShow: ratingList.slice(0, 75),
        });
    }

    onShowDescr() {
        this.setState({
            showDescription: !this.state.showDescription,
        })
    }

    render() {
        return (
            <>
                <Helmet>
                    <link rel="canonical" href="https://pogpvp.com/pvprating" />

                    <title>{strings.pageheaders.pvprating}</title>
                    <meta name="description" content={strings.pagedescriptions.pvprating} />

                    <meta property="og:title" content={strings.pageheaders.pvprating} />
                    <meta property="og:url" content="https://pogpvp.com/pvprating"></meta>
                    <meta property="og:description" content={strings.pagedescriptions.pvprating} />

                    <meta property="twitter:title" content={strings.pageheaders.pvprating} />
                    <meta property="twitter:url" content="https://pogpvp.com/pvprating"></meta>
                    <meta property="twitter:description" content={strings.pagedescriptions.pvprating} />
                </Helmet>
                <div className=" container-fluid mt-3 mb-5">
                    <div className="row justify-content-center px-1 px-sm-2 mx-md-3 pb-5">
                        <div className="col-12 bigWidth m-0 p-0">
                            <div className="row m-0 p-0 singleNews mb-2 p-2">
                                <div className="col-12 col-sm-6 m-0 p-1">
                                    <SelectGroup
                                        class="input-group input-group-sm p-0 m-0"
                                        name="league"
                                        value={this.state.league}
                                        onChange={this.onChange}
                                        options={this.state.leagueList}
                                        label={"\xa0\xa0\xa0\xa0\xa0" + strings.title.league + "\xa0\xa0\xa0\xa0\xa0"}
                                        for=""
                                    />
                                </div>
                                <div className="col-12 col-sm-6 m-0 p-0 p-1">
                                    <SelectGroup
                                        class="input-group input-group-sm "
                                        name="combination"
                                        value={this.state.combination}
                                        onChange={this.onChange}
                                        options={this.state.combinationList}
                                        label={strings.rating.ratingType}

                                        place={"bottom"}
                                        for={"rating"}
                                        tip={this.state.ratingTip}
                                        tipClass='strategyTips'
                                    />
                                </div>
                            </div>
                            <div className="row singleNews m-0 p-0 px-3 py-2 mb-3" >
                                <div onClick={this.onShowDescr} className="col-12 d-flex justify-content-between m-0 p-0 pb-1 clickable">
                                    <div className="font-weight-bold ml-1">{strings.title.aboutrate}</div>
                                    <i className={this.state.showDescription ? "align-self-center fas fa-angle-up fa-lg " : "align-self-center fas fa-angle-down fa-lg"}></i>
                                </div>
                                <UnmountClosed isOpened={this.state.showDescription}>
                                    <div className="row justify-content-center m-0 p-0">
                                        <RatingDescr />
                                    </div>
                                </UnmountClosed>
                            </div>

                            <div className="row justify-content-center m-0 p-0">
                                <div className="singleNews bigWidth col-md-10 col-lg-8 p-2 m-0">
                                    {this.state.loading && <div className="row  justify-content-center"  >
                                        <div style={{ fontWeight: "500", color: "black" }} >
                                            {strings.tips.loading}
                                            <BarLoader
                                                color={"black"}
                                                loading={this.state.loading}
                                            />
                                        </div>
                                    </div>}
                                    {this.state.showResult &&
                                        <>
                                            <div className="col m-0 px-2 py-2">
                                                <input onChange={this.onChangeInput}
                                                    className="form-control" type="text"
                                                    placeholder={strings.shinyrates.searchplaceholder}>
                                                </input>
                                            </div>

                                            <div className="row m-0 p-0 justify-content-center">
                                                {this.state.listToShow}
                                            </div>


                                            <div className="col d-flex p-0 m-0 pt-2  justify-content-center">
                                                {(this.state.isNextPage && !this.state.searchState) && <SubmitButton
                                                    action="Load more"
                                                    label={strings.buttons.loadmore}
                                                    onSubmit={this.onLoadMore}
                                                    class="newsButton btn btn-primary btn-sm"
                                                />}
                                            </div>
                                        </>}
                                    {this.state.isError && <Errors class="alert alert-danger m-0 py-2" value={this.state.error} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default PvpRating


//generation functions

function returnRatingList(ratingList, pokemonTable, moveTable, league, combination) {
    let result = []

    var maxWeighted = ratingList[0].AvgRateWeighted

    for (var i = 0; i < ratingList.length; i++) {
        var pokName = checkShadow(ratingList[i].Name, pokemonTable)
        if (!pokemonTable[pokName]) {
            console.log(pokName + " not found")
            continue
        }
        result.push(
            <div key={ratingList[i].Name} className={"col-12 px-1 pt-1"}>
                <PokemonCard
                    class={"cardBig m-0 p-0"}

                    name={<div className="d-flex justify-content-between">
                        <div className="pl-2">{"#" + (i + 1)}</div>
                        <div className=" text-center">

                            {(pokName !== ratingList[i].Name) && <abbr title={strings.options.type.shadow} className="initialism">
                                <Shadow className="allign-self-center icon24 ml-1 pb-1" />
                            </abbr>}
                            <>{pokName}</>
                        </div>
                        <div></div>
                    </div>}
                    icon={<PokemonIconer
                        src={pokemonTable[pokName].Number + (pokemonTable[pokName].Forme !== "" ? "-" + pokemonTable[pokName].Forme : "")}
                        class={"icon64"} />}
                    body={generateBody(pokName, ratingList[i], pokemonTable, maxWeighted)}
                    footer={<Collapsable
                        pokemonTable={pokemonTable}
                        moveTable={moveTable}
                        ratingList={ratingList}

                        container={ratingList[i]}
                        league={league}
                        combination={combination}
                    />}

                    classHeader={"bigCardHeader col-12 m-0 p-0 px-1"}
                    classIcon={"icon64  col-auto mx-2 mt-2 p-0 align-self-center"}
                    classBody={"bigCardBody bigWidth  col-8 col-md-10 align-self-center m-0 p-1 p-0 "}
                    classFooter="col-12 m-0  mb-2"
                />
            </div>)
    }
    return result

}

function generateBody(name, entry, pokemonTable, maxWeighted) {
    return <div className="row justify-content-between m-0 p-0">
        <div className="col-10 col-sm-5 m-0 p-0">
            <div className="row  m-0 p-0">
                <div className="col-12 m-0 p-0">
                    <div className="d-inline bigText mr-2">
                        {strings.rating.type}
                    </div>
                    {(pokemonTable[name]["Type"][0] !== undefined) && <Type
                        class={"icon18"}
                        code={pokemonTable[name]["Type"][0]}
                        value={typeDecoder[pokemonTable[name]["Type"][0]]}
                    />}
                    {(pokemonTable[name]["Type"][1] !== undefined) && <Type
                        class={"ml-2 icon18"}
                        code={pokemonTable[name]["Type"][1]}
                        value={typeDecoder[pokemonTable[name]["Type"][1]]}
                    />}
                </div>
                <div className="col-12 text-start bigText m-0 p-0">
                    {strings.rating.avgRate} {entry.AvgRate}
                </div>
                <div className="col-12 text-start bigText m-0 p-0">
                    {strings.rating.avgWin} {(entry.AvgWinrate * 100).toFixed(0)}
                </div>
            </div>
        </div>
        <div className="col-10 col-sm-2  text-sm-center text-left  mx-sm-2 p-0 ">
            <div className="row rating  m-0 px-2 p-sm-0 ">
                <div className="col-auto   col-sm-12 mr-1 mr-sm-0 m-0 p-0 ">
                    {strings.rating.score} </div>
                <div className="col-auto col-sm-12 m-0 p-0 ">
                    {(entry.AvgRateWeighted / maxWeighted * 100).toFixed(1)}
                </div>
            </div>
        </div>
    </div>

}