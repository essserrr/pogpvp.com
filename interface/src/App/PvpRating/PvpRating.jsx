import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';

import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"
import SubmitButton from "../PvP/components/SubmitButton/SubmitButton"
import Collapsable from "./Collapsable/Collapsable"
import Errors from "../PvP/components/Errors/Errors"
import SelectGroup from "../PvP/components/SelectGroup/SelectGroup";
import PokemonCard from "../Evolve/PokemonCard/PokemonCard"
import RatingDescr from "./RatingDescr/RatingDescr"
import Loader from "./Loader"
import DropWithArrow from "./DropWithArrow/DropWithArrow"
import CardBody from "./CardBody/CardBody"

import { ReactComponent as Shadow } from "../../icons/shadow.svg";
import { checkShadow, getCookie, capitalizeFirst } from "../../js/indexFunctions"

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
        this.updateState = this.updateState.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onShowDescr = this.onShowDescr.bind(this);
    }


    async componentDidMount() {
        let obj = this.returnUpdObj(this.props.match.params.league ? capitalizeFirst(this.props.match.params.league) : "",
            this.props.match.params.type ? String(this.props.match.params.type) : "")
        this.updateState(obj.defaultLeague, obj.defaultType, obj.defaultPath)
    }


    componentDidUpdate(prevProps) {
        if (prevProps.match.params.league === this.props.match.params.league &&
            prevProps.match.params.type === this.props.match.params.type) {
            return
        }
        let obj = this.returnUpdObj(this.props.match.params.league ? capitalizeFirst(this.props.match.params.league) : "",
            this.props.match.params.type ? String(this.props.match.params.type) : "")
        this.updateState(obj.defaultLeague, obj.defaultType, obj.defaultPath)
    }

    returnUpdObj(leagueString, typeString) {
        let obj = {
            defaultLeague: "Great",
            defaultType: "overall",
            defaultPath: "Great",
        }
        if (leagueString && typeString) {
            obj.defaultPath = leagueString + (typeString === "overall" ? "" : typeString)
            obj.defaultLeague = leagueString
            obj.defaultType = typeString
        }
        return obj
    }


    async updateState(defaultLeague, defaultType, defaultPath) {
        this.setState({
            league: defaultLeague,
            combination: defaultType,
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
        let reason = ""
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
            responses[2].json(),
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
                return
            }
        }

        let ratingList = this.returnRatingList(results[1], results[0], results[2])
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




    returnRatingList(ratingList, pokemonTable, moveTable) {
        return ratingList.reduce((result, elem, i) => {
            let pokName = checkShadow(elem.Name, pokemonTable)
            if (!pokName) {
                return result
            }
            result.push(
                <div key={elem.Name} className={"col-12 px-1 pt-1"}>
                    <PokemonCard
                        class={"col-12 cardBig m-0 p-0"}

                        name={<div className="d-flex justify-content-between">
                            <div className="pl-2">{"#" + (i + 1)}</div>
                            <div className=" text-center">
                                <>{pokName + ((pokName !== elem.Name) ? " (" + strings.options.type.shadow + ")" : "")}</>
                            </div>
                            <div></div>
                        </div>}
                        icon={<>
                            {(pokName !== elem.Name) &&
                                <Shadow className="posAbsR icon24" />}
                            <a
                                className="link"
                                title={strings.dexentr + pokName}
                                href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                                    encodeURIComponent(pokName)}
                            >
                                <PokemonIconer
                                    src={pokemonTable[pokName].Number + (pokemonTable[pokName].Forme !== "" ? "-" + pokemonTable[pokName].Forme : "")}
                                    class={"icon64"} />
                            </a>
                        </>}
                        body={<CardBody
                            name={pokName}
                            pokemonTable={pokemonTable}
                            maxWeighted={ratingList[0].AvgRateWeighted}
                            entry={elem}
                        />}
                        footer={<Collapsable
                            pokemonTable={pokemonTable}
                            moveTable={moveTable}
                            ratingList={ratingList}

                            container={elem}
                            league={this.state.league}
                            combination={this.state.combination}
                        />}

                        classHeader={"bigCardHeader col-12 m-0 p-0 px-1"}
                        classIcon={"icon64  col-auto mx-2 mt-2 p-0 align-self-center"}
                        classBody={"bigCardBody col align-self-center m-0 p-1 p-0 "}
                        classBodyWrap={"row justify-content-between  m-0 p-0"}
                        classFooter="col-12 m-0  mb-2"
                    />
                </div>)
            return result;
        }, []);
    }








    onLoadMore() {
        let newN = (this.state.n + 75) <= this.state.ratingList.length ? this.state.n + 75 : this.state.ratingList.length
        this.setState({
            n: newN,
            isNextPage: this.state.ratingList.length - newN > 0,
            listToShow: this.state.ratingList.slice(0, newN),
        });
    }



    onChangeInput(event) {
        if (!event.target.value) {
            this.setState({
                searchState: false,
                listToShow: this.state.ratingList.slice(0, this.state.n),
            });
            return
        }
        this.setState({
            searchState: true,
            listToShow: this.state.ratingList.filter(e => e.key.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1),
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

        let reason = ""
        //fecth for new rating result
        let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/rating/" + typeOfrating, {
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
        let data = await response.json();
        if (!response.ok) {
            this.setState({
                error: data.detail,
                showResult: false,
                loading: false,
                isError: true,
            });
            return
        }

        let ratingList = this.returnRatingList(data, this.state.pokemonTable, this.state.moveTable)

        this.props.history.push("/pvprating/" + leaguePath.toLowerCase() + "/" + typePath)
        this.setState({
            n: 75,
            isNextPage: data.length - 75 > 0,

            showResult: true,
            isError: false,
            loading: false,
            searchState: false,

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
                <SiteHelm
                    url="https://pogpvp.com/pvprating"
                    header={strings.pageheaders.pvprating}
                    descr={strings.pagedescriptions.pvprating}
                />
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
                                <DropWithArrow
                                    onShow={this.onShowDescr}
                                    show={this.state.showDescription}
                                    title={strings.title.aboutrate}
                                    elem={<RatingDescr />}

                                    faOpened="align-self-center fas fa-angle-up fa-lg "
                                    faClosed="align-self-center fas fa-angle-down fa-lg"
                                    outClass="col-12 d-flex justify-content-between m-0 p-0 pb-1 clickable"
                                    inClass="row justify-content-center m-0 p-0" />
                            </div>
                            <div className="row justify-content-center m-0 p-0">
                                <div className="singleNews bigWidth col-md-12 col-lg-12 p-2 m-0">
                                    {this.state.loading &&
                                        <Loader
                                            color="black"
                                            weight="500"
                                            locale={strings.tips.loading}
                                            loading={this.state.loading}
                                        />}
                                    {this.state.isError && <Errors class="alert alert-danger m-0 py-2" value={this.state.error} />}
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


                                            <div className="col d-flex p-0 m-0 pt-3  justify-content-center">
                                                {(this.state.isNextPage && !this.state.searchState) && <SubmitButton
                                                    action="Load more"
                                                    label={strings.buttons.loadmore}
                                                    onSubmit={this.onLoadMore}
                                                    class="longButton btn btn-primary btn-sm"
                                                />}
                                            </div>
                                        </>}
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


