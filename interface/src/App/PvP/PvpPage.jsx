import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import DropWithArrow from "../PvpRating/DropWithArrow/DropWithArrow"
import LocalizedStrings from 'react-localization';
import ReactTooltip from "react-tooltip";

import SinglePvp from "./SinglePvp"
import MatrixPvp from "./MatrixPvp"
import SelectGroup from "./components/SelectGroup/SelectGroup";
import Checkbox from "../RaidsList/Checkbox"
import MatrixDescr from "./components/Description/MatrixDescr"
import SingleDescr from "./components/Description/SingleDescr"
import Loader from "../PvpRating/Loader"



import {
    getCookie, extractPokemon, extractData, returnMovePool, calculateMaximizedStats, returnPokList, separateMovebase,
    calculateEffStat
} from "../../js/indexFunctions"
import { locale } from "../../locale/locale"



let strings = new LocalizedStrings(locale);

function setUpPokemon(pok, hisResult, pokemonTable) {
    pok.HP = hisResult.HP
    pok.Energy = hisResult.EnergyRemained

    var moves = returnMovePool(pok.name, pokemonTable, strings.options.moveSelect, false, [pok.QuickMove], [pok.ChargeMove1, pok.ChargeMove2])
    pok.quickMovePool = moves.quickMovePool
    pok.chargeMovePool = moves.chargeMovePool

    pok.ivSet = { 40: calculateMaximizedStats(pok.name, 40.0, pokemonTable) }
    pok.effAtk = calculateEffStat(pok.name, pok.Lvl, pok.Atk, pok.AtkStage, pokemonTable, "Atk", pok.IsShadow)
    pok.effDef = calculateEffStat(pok.name, pok.Lvl, pok.Def, pok.DefStage, pokemonTable, "Def", pok.IsShadow)
    pok.effSta = calculateEffStat(pok.name, pok.Lvl, pok.Sta, 0, pokemonTable, "Sta")

    return pok
}


class PvpPage extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            error: "",
            showResult: false,
            isError: false,
            pokemonTable: "",
            moveTable: "",
            pokList: "",
            chargeMoveList: "",
            quickMoveList: "",
            league: "",
            pvpoke: false,


            isLoaded: false,
            leaguesList: [
                <option value="great" key="great">{strings.options.league.great}</option>,
                <option value="ultra" key="ultra">{strings.options.league.ultra}</option>,
                <option value="master" key="master">{strings.options.league.master}</option>,
            ],
            loading: false,
            showCollapse: false,
        };
        this.onChange = this.onChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.onPvpokeEnable = this.onPvpokeEnable.bind(this);
        this.onClick = this.onClick.bind(this);
    }



    componentDidMount() {
        this.updateState(
            this.props.match.params.league,
            this.props.match.params.pok1,
            this.props.match.params.pok2,
            this.props.match.params.simtype,
        )
    }

    componentDidUpdate(prevProps) {
        const update = this.updateState
        window.onpopstate = function (event) {
            let windowPath = window.location.pathname.split('/').slice(2)
            let league = windowPath[1]
            let pok1 = windowPath[2]
            let pok2 = windowPath[3]
            let simtype = windowPath[4]
            update(league, pok1, pok2, simtype)
        }
    }



    async updateState(league, pok1, pok2, simtype) {
        this.setState({
            loading: true,
            pvpoke: simtype === "pvpoke" ? true : false,
        })
        var extractedData = extractData(league, pok1, pok2)
        var reason = ""
        let fetches = [
            fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
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
            //after opening the page get pokemonBase
        ];
        if (extractedData.attacker !== undefined && extractedData.defender !== undefined) {
            fetches.push(fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + window.location.pathname.replace("pvp", "request").replace("/pvpoke", ""), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Pvp-Type': simtype === "pvpoke" ? "pvpoke" : "normal",
                },
            }))
        }
        var responses = await Promise.all(fetches).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {

            this.setState({
                isError: true,
                error: String(reason),
                isLoaded: true,
                showResult: false,
                loading: false,
                league: (extractedData.league) ? extractedData.league : "great",

                pokemonTable: [],
                moveTable: [],
                pokList: [],
                chargeMoveList: [],
                quickMoveList: [],
            });
            return
        }

        let parses = [
            responses[0].json(),
            responses[1].json(),
        ]
        if (extractedData.attacker !== undefined && extractedData.defender !== undefined) {
            parses.push(responses[2].json())
        }
        var results = await Promise.all(parses)

        let pokList = [];
        if (results[0]) {
            pokList = returnPokList(results[0])
        }

        let movebaseSeparated = [];
        if (results[1]) {
            movebaseSeparated = separateMovebase(results[1])
        }

        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                if (results[i].detail === "PvP error") {
                    this.setState({
                        showResult: false,
                        isLoaded: true,
                        isError: true,
                        loading: false,
                        error: results[i].case.What,
                        league: (extractedData.league) ? extractedData.league : "great",

                        pokemonTable: (results[0]) ? results[0] : [],
                        moveTable: (results[1]) ? results[1] : [],
                        pokList: (pokList) ? pokList : [],
                        chargeMoveList: (movebaseSeparated.chargeMoveList) ? movebaseSeparated.chargeMoveList : [],
                        quickMoveList: (movebaseSeparated.quickMoveList) ? movebaseSeparated.quickMoveList : [],
                    });
                    return;
                }
                this.setState({
                    isError: true,
                    error: results[i].detail,
                    isLoaded: true,
                    showResult: false,
                    loading: false,
                    league: (extractedData.league) ? extractedData.league : "great",

                    pokemonTable: (results[0]) ? results[0] : [],
                    moveTable: (results[1]) ? results[1] : [],
                    pokList: (pokList) ? pokList : [],
                    chargeMoveList: (movebaseSeparated.chargeMoveList) ? movebaseSeparated.chargeMoveList : [],
                    quickMoveList: (movebaseSeparated.quickMoveList) ? movebaseSeparated.quickMoveList : [],
                });
                return;
            }
        }
        if (extractedData.attacker !== undefined) {
            var attacker = setUpPokemon(extractPokemon(extractedData.attacker), (results[2]) ? results[2].Attacker : {}, results[0])
        }
        if (extractedData.defender !== undefined) {
            var defender = setUpPokemon(extractPokemon(extractedData.defender), (results[2]) ? results[2].Defender : {}, results[0])
        }

        this.setState({
            attacker: attacker,
            defender: defender,
            pvpResult: results[2],
            showResult: (results[2]) ? true : false,
            url: (extractedData.attacker !== undefined && extractedData.defender !== undefined) ? window.location.href : "",
            league: (extractedData.league) ? extractedData.league : "great",

            pokemonTable: results[0],
            moveTable: results[1],
            pokList: pokList,
            chargeMoveList: movebaseSeparated.chargeMoveList,
            quickMoveList: movebaseSeparated.quickMoveList,
            isLoaded: true,
            loading: false,
        });
    }



    onChange(event) {

        this.setState({
            [event.target.name]: event.target.value

        });

    }

    onPvpokeEnable(event) {
        this.setState({
            [event.target.name]: !Boolean(this.state[event.target.name]),
        })
    }
    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse
        })
    }


    render() {
        return (
            <>
                <SiteHelm
                    url={this.props.match.params.type === "matrix" ? "https://pogpvp.com/pvp/matrix" :
                        "https://pogpvp.com/pvp/single"}
                    header={this.props.match.params.type === "matrix" ? strings.pageheaders.matrix :
                        strings.pageheaders.single}
                    descr={this.props.match.params.type === "matrix" ? strings.pagedescriptions.matrix :
                        strings.pagedescriptions.single}
                />
                <div className=" container-fluid pt-2 pt-md-2 mb-5">
                    <div className="row justify-content-center px-1">
                        <div className="col-12 results mediumWidth p-2  m-0">
                            <div className="row d-flex m-0 p-0">
                                <div className="col-6 col-sm-7 col-md-8 align-self-center m-0 p-0">
                                    <SelectGroup
                                        name="league"
                                        class="input-group input-group-sm"
                                        value={this.state.league}
                                        onChange={this.onChange}
                                        options={this.state.leaguesList}
                                        label={strings.title.league}
                                        for=""
                                    />
                                </div>
                                <div className="col-6 col-sm-5 col-md-4 d-flex m-0 p-0 align-self-center justify-content-between">
                                    <Checkbox
                                        class={"form-check form-check-inline m-0 p-0 ml-4"}
                                        checked={this.state.pvpoke ? "checked" : false}
                                        name={"pvpoke"}
                                        label={
                                            <div className=" text-center">
                                                {strings.title.pvpoke}

                                            </div>
                                        }
                                        onChange={this.onPvpokeEnable}
                                    />
                                    <i data-tip data-for={"pvpoke"} className="align-self-center fas fa-info-circle fa-lg ml-2">
                                        <ReactTooltip
                                            className={"infoTip"}
                                            id={"pvpoke"} effect='solid'
                                            place={"top"}
                                            multiline={true}
                                        >
                                            {strings.tips.pvpoke}
                                        </ReactTooltip>
                                    </i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row  mx-0 mx-lg-2 justify-content-center">
                        {this.state.loading && <div className="col-12   mb-4"  >
                            <Loader
                                color="white"
                                weight="500"
                                locale={strings.tips.loading}
                                loading={this.state.loading}

                                class="row  m-0 p-0 justify-content-center"
                                innerClass="col-auto p-4 ml-1 mx-lg-0 mt-1  mt-md-2"
                            />
                        </div>}
                        <div className="col-12 superBig m-0 p-0">
                            {(this.state.isLoaded && (this.props.match.params.type === "single")) &&
                                <SinglePvp parentState={this.state} />
                            }
                            {(this.state.isLoaded && (this.props.match.params.type === "matrix")) &&
                                <MatrixPvp parentState={this.state} />
                            }
                        </div>
                    </div>
                    <div className="row justify-content-center px-1 ">
                        <div className="col-12 superBig-1 results m-0 p-0 px-3 py-2" >
                            <DropWithArrow
                                onShow={this.onClick}
                                show={this.state.showCollapse}
                                title={strings.title.about}
                                elem={this.state.isLoaded && ((this.props.match.params.type === "matrix") ? <MatrixDescr /> : <SingleDescr />)}

                                faOpened="align-self-center fas fa-angle-up fa-lg "
                                faClosed="align-self-center fas fa-angle-down fa-lg"
                                outClass="row justify-content-between m-0 p-0 pb-1 clickable"
                                inClass="row justify-content-center m-0 p-0" />
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default PvpPage