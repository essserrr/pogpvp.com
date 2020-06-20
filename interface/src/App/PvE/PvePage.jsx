import React from "react";
import { Helmet } from "react-helmet";
import LocalizedStrings from 'react-localization';
import BarLoader from "react-spinners/BarLoader";

import {
    getCookie, extractRaidData, returnMovePool, returnPokList, separateMovebase, extractPveObj, extractPveBoss, extractPveAttacker
} from "../../js/indexFunctions"
import { locale } from "../../locale/locale"
import CommonPve from "./CommonPve"


let strings = new LocalizedStrings(locale);

class PvePage extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            tables: {
                weather: {
                    0: {},
                    1: {
                        10: 1.2,
                        9: 1.2,
                        6: 1.2,
                    },
                    2: {
                        0: 1.2,
                        3: 1.2,
                        17: 1.2,
                    },
                    3: {
                        15: 1.2,
                        12: 1.2,
                    },
                    4: {
                        13: 1.2,
                        4: 1.2,
                        5: 1.2,
                    },
                    5: {
                        14: 1.2,
                        7: 1.2,
                        2: 1.2,
                    },
                    6: {
                        16: 1.2,
                        11: 1.2,
                    },
                    7: {
                        8: 1.2,
                        1: 1.2,
                    },
                },

                friend: {
                    0: 1.0,
                    1: 1.03,
                    2: 1.05,
                    3: 1.07,
                    4: 1.1,
                    5: 1.06,
                    6: 1.12,
                    7: 1.18,
                    8: 1.25,
                },

                hp: {
                    0: 600,
                    1: 1800,
                    2: 3600,
                    3: 9000,
                    4: 15000,
                    5: 22500,
                },

                timer: {
                    0: 180,
                    1: 180,
                    2: 180,
                    3: 180,
                    4: 300,
                    5: 300,
                },

                mult: {
                    0: 0.5974,
                    1: 0.67,
                    2: 0.73,
                    3: 0.79,
                    4: 0.79,
                    5: 0.79,
                },
            },


            error: "",
            showResult: false,
            isError: false,
            pokemonTable: "",
            moveTable: "",
            pokList: "",
            chargeMoveList: "",
            quickMoveList: "",

            isLoaded: false,
            loading: false,
        };
        this.updateState = this.updateState.bind(this);
    }



    componentDidMount() {
        this.updateState(this.props.match.params.type,
            this.props.match.params.attacker,
            this.props.match.params.boss,
            this.props.match.params.obj,
        )
    }

    componentDidUpdate(prevProps) {
        const update = this.updateState
        window.onpopstate = function (event) {
            let windowPath = window.location.pathname.split('/').slice(2)
            let type = windowPath[0]
            let party = windowPath[1]
            let boss = windowPath[2]
            let obj = windowPath[3]

            update(type, party, boss, obj)
        }
    }



    async updateState(type, party, boss, obj) {
        switch (type) {
            case "common":
                var title = strings.pageheaders.common;
                var description = strings.pagedescriptions.common;
                var urlSEO = "https://pogpvp.com/pve/common";
                break
            default:
                title = strings.pageheaders.common;
                description = strings.pagedescriptions.common;
                urlSEO = "https://pogpvp.com/pve/common";
                break
        }
        this.setState({
            loading: true,
            title: title,
            description: description,
            urlSEO: urlSEO,
        })

        var extrData = extractRaidData(party, boss, obj)
        var reason = ""
        //after opening the page get pokemonBase
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
        ];
        if (extrData.attackerObj !== undefined && extrData.bossObj !== undefined && extrData.pveObj !== undefined) {
            fetches.push(fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST :
                process.env.REACT_APP_PRERENDER) + window.location.pathname.replace("pve", "request"), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
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
        if (extrData.attackerObj !== undefined && extrData.bossObj !== undefined && extrData.pveObj !== undefined) {
            parses.push(responses[2].json())
        }
        var results = await Promise.all(parses)

        let pokList = [];
        if (results[0]) {
            pokList = returnPokList(results[0], true, strings.options.moveSelect.none)

        }

        let movebaseSeparated = [];
        if (results[1]) {
            movebaseSeparated = separateMovebase(results[1])
        }

        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                if (results[i].detail === "PvE error") {
                    this.setState({
                        showResult: false,
                        isLoaded: true,
                        isError: true,
                        loading: false,
                        error: results[i].case.What,

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

                    pokemonTable: (results[0]) ? results[0] : [],
                    moveTable: (results[1]) ? results[1] : [],
                    pokList: (pokList) ? pokList : [],
                    chargeMoveList: (movebaseSeparated.chargeMoveList) ? movebaseSeparated.chargeMoveList : [],
                    quickMoveList: (movebaseSeparated.quickMoveList) ? movebaseSeparated.quickMoveList : [],
                });
                return;
            }
        }

        if (extrData.attackerObj !== undefined) {
            var attackerObj = this.setUpPokemon(extractPveAttacker(extrData.attackerObj), results[0])
        }
        if (extrData.bossObj !== undefined) {

            var bossObj = this.setUpPokemon(extractPveBoss(extrData.bossObj), results[0], true)
        }
        if (extrData.pveObj !== undefined) {
            var pveObj = extractPveObj(extrData.pveObj)
        }

        this.setState({
            attackerObj: attackerObj,
            bossObj: bossObj,
            pveObj: pveObj,

            pveResult: results[2],
            showResult: (results[2]) ? true : false,
            url: (extrData.attackerObj !== undefined && extrData.bossObj !== undefined && extrData.pveObj !== undefined) ? window.location.href : "",

            pokemonTable: results[0],
            moveTable: results[1],
            pokList: pokList,
            chargeMoveList: movebaseSeparated.chargeMoveList,
            quickMoveList: movebaseSeparated.quickMoveList,
            isLoaded: true,
            loading: false,
        });
    }

    setUpPokemon(pok, pokemonTable, isBoss) {
        var moves = returnMovePool(pok.Name, pokemonTable, strings.options.moveSelect,
            isBoss, [pok.QuickMove], [pok.ChargeMove])
        pok.quickMovePool = moves.quickMovePool
        pok.chargeMovePool = moves.chargeMovePool
        return pok
    }

    render() {
        return (
            <>
                <Helmet>
                    <link rel="canonical" href={this.state.urlSEO} />

                    <title>{this.state.title}</title>
                    <meta name="description" content={this.state.description} ></meta>

                    <meta property="og:title" content={this.state.title}  ></meta>
                    <meta property="og:url" content={this.state.urlSEO}></meta>
                    <meta property="og:description" content={this.state.description} ></meta>


                    <meta property="twitter:title" content={this.state.title} ></meta>
                    <meta property="twitter:url" content={this.state.urlSEO}></meta>
                    <meta property="twitter:description" content={this.state.description} ></meta>
                </Helmet>
                <div className=" container-fluid m-0 p-0 pt-2 pt-md-2 mb-5">
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
                        <div className="col-12 superBig m-0 p-0 px-1">
                            {(this.state.isLoaded && (this.props.match.params.type === "common")) && <CommonPve
                                parentState={this.state}
                            />}
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

export default PvePage