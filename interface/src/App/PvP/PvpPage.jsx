import React from "react";
import { Helmet } from "react-helmet";
import LocalizedStrings from 'react-localization';
import BarLoader from "react-spinners/BarLoader";
import ReactTooltip from "react-tooltip";

import SinglePvp from "./SinglePvp"
import MatrixPvp from "./MatrixPvp"
import SelectGroup from "./components/SelectGroup/SelectGroup";
import PokemonIconer from "./components/PokemonIconer/PokemonIconer"
import Checkbox from "../RaidsList/Checkbox"


import { getCookie, extractPokemon, extractData, returnMovePool, calculateMaximizedStats, calculateEffStat } from "../../js/indexFunctions"
import { locale } from "../../locale/locale"



let strings = new LocalizedStrings(locale);

function setUpPokemon(pok, hisResult, pokemonTable) {
    pok.HP = hisResult.HP
    pok.Energy = hisResult.EnergyRemained

    var moves = returnMovePool(pok.name, pokemonTable, strings.options.moveSelect)
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
            pvppoke: false,


            isLoaded: false,
            leaguesList: [
                <option value="great" key="great">{strings.options.league.great}</option>,
                <option value="ultra" key="ultra">{strings.options.league.ultra}</option>,
                <option value="master" key="master">{strings.options.league.master}</option>,
            ],
            loading: false,
        };
        this.onChange = this.onChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.onPvppokeEnable = this.onPvppokeEnable.bind(this);
    }



    componentDidMount() {
        this.updateState(this.props.match.params.type,
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
            let type = windowPath[0]
            let league = windowPath[1]
            let pok1 = windowPath[2]
            let pok2 = windowPath[3]
            let simtype = windowPath[4]

            update(type, league, pok1, pok2, simtype)
        }
    }



    async updateState(type, league, pok1, pok2, simtype) {
        switch (type) {
            case "single":
                var title = strings.pageheaders.single;
                var description = strings.pagedescriptions.single;
                break
            case "matrix":
                title = strings.pageheaders.matrix;
                description = strings.pagedescriptions.matrix;
                break
            default:
                title = strings.pageheaders.single;
                description = strings.pagedescriptions.single;
                break
        }
        this.setState({
            loading: true,
            title: title,
            pvppoke: simtype === "pvpoke" ? true : false,
            description: description,
        })
        var extractedData = extractData(league, pok1, pok2)
        var reason = ""
        let fetches = [
            fetch(((navigator.userAgent != "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            fetch(((navigator.userAgent != "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/moves", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                },
            }),
            //after opening the page get pokemonBase
        ];
        if (extractedData.attacker !== undefined && extractedData.defender !== undefined) {
            fetches.push(fetch(((navigator.userAgent != "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + window.location.pathname.replace("pvp", "request").replace("/pvpoke", ""), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Pvp-Type': simtype === "pvpoke" ? "pvppoke" : "normal",
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
            //create pokemons list
            for (let key in results[0]) {
                if (results[0][key].QuickMoves[0] !== "") {
                    pokList.push({
                        value: key,
                        label: <div style={{ textAlign: "left" }}>
                            <PokemonIconer src={key} class={"icon24 mr-1"} />{key}
                        </div>,
                    });
                }
            }
        }
        let chargeMoveList = [];
        let quickMoveList = [];
        if (results[1]) {
            //create pokemons list
            for (let key in results[1]) {
                switch (results[1][key].MoveCategory) {
                    case "Charge Move":
                        chargeMoveList.push({
                            value: key,
                            label: key,
                        });
                        break
                    case "Fast Move":
                        quickMoveList.push({
                            value: key,
                            label: key,
                        });
                        break
                    default:
                }
            }
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
                        chargeMoveList: (chargeMoveList) ? chargeMoveList : [],
                        quickMoveList: (quickMoveList) ? quickMoveList : [],
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
                    chargeMoveList: (chargeMoveList) ? chargeMoveList : [],
                    quickMoveList: (quickMoveList) ? quickMoveList : [],
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
            chargeMoveList: chargeMoveList,
            quickMoveList: quickMoveList,
            isLoaded: true,
            loading: false,
        });
    }



    onChange(event) {

        this.setState({
            [event.target.name]: event.target.value

        });

    }

    onPvppokeEnable(event) {
        this.setState({
            [event.target.name]: !Boolean(this.state[event.target.name]),
        })
    }


    render() {
        return (
            <>
                <Helmet>
                    <title>{this.state.title}</title>
                    <meta name="title" content={this.state.title} />
                    <meta name="description" content={this.state.description} />

                    <meta property="og:title" content={this.state.title} />
                    <meta property="og:description" content={this.state.description} />

                    <meta property="twitter:title" content={this.state.title} />
                    <meta property="twitter:description" content={this.state.description} />
                </Helmet>
                <div className=" container-fluid pt-2 pt-md-2 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-auto results p-2">
                            <div className="row d-flex p-0 m-0">
                                <div className="col-6 m-0 p-0">
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
                                <div className="col-6 m-0 p-0 pl-3 align-self-center">
                                    <Checkbox
                                        checked={this.state.pvppoke ? "checked" : false}
                                        name={"pvppoke"}
                                        label={
                                            <div className=" text-center">
                                                {strings.title.pvpoke}
                                                <i data-tip data-for={"pvppoke"} className="fas fa-info-circle ml-1">
                                                    <ReactTooltip
                                                        className={"strategyTips"}
                                                        id={"pvppoke"} effect='solid'
                                                        place={"top"}
                                                        multiline={true}
                                                    >
                                                        {strings.tips.pvpoke}
                                                    </ReactTooltip>
                                                </i>
                                            </div>
                                        }
                                        onChange={this.onPvppokeEnable}
                                    />
                                </div>


                            </div>

                        </div>
                    </div>
                    <div className="row  mx-0 mx-lg-2 justify-content-center">
                        {this.state.loading && <div className="col-12   mb-4"  >
                            <div className="row  m-0 p-0 justify-content-center">
                                <div className=" col-auto p-4 ml-1 mx-lg-0 mt-1  mt-md-2" style={{ fontWeight: "500", color: "white" }} >
                                    {strings.tips.loading}
                                    <BarLoader
                                        color={"white"}
                                        loading={this.state.loading}
                                    />
                                </div>
                            </div>

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


                </div >
            </>
        );
    }
}

export default PvpPage