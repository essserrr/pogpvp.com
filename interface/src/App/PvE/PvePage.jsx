import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from 'react-localization';

import {
    getCookie, extractRaidData, returnMovePool, returnPokList, separateMovebase, extractPveObj, extractPveBoss, extractPveAttacker
} from "../../js/indexFunctions"
import { locale } from "../../locale/locale"
import CommonPve from "./CommonPve"
import Loader from "../PvpRating/Loader"
import DropWithArrow from "../PvpRating//DropWithArrow/DropWithArrow"
import CommonDescr from "./Components/Description/CommonDescr"



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
        this.onClick = this.onClick.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
    }



    componentDidMount() {
        this.updateState(
            this.props.match.params.attacker,
            this.props.match.params.boss,
            this.props.match.params.obj,
        )
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.attacker === prevProps.match.params.attacker &&
            this.props.match.params.boss === prevProps.match.params.boss &&
            this.props.match.params.obj === prevProps.match.params.obj) {
            return
        }

        this.updateState(
            this.props.match.params.attacker,
            this.props.match.params.boss,
            this.props.match.params.obj,
        )
    }



    async updateState(party, boss, obj) {
        this.setState({
            loading: true,
        })

        let extrData = extractRaidData(party, boss, obj)
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
        let reason = ""
        let responses = await Promise.all(fetches).catch(function (r) {
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
        let results = await Promise.all(parses)

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

            date: (results[2]) ? Date.now() : 1,
            pveResult: results[2],
            showResult: (results[2]) ? true : false,
            url: window.location.href,

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
        let moves = returnMovePool(pok.Name, pokemonTable, strings.options.moveSelect,
            isBoss, [pok.QuickMove], [pok.ChargeMove])
        pok.quickMovePool = moves.quickMovePool
        pok.chargeMovePool = moves.chargeMovePool
        return pok
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse
        })
    }

    changeUrl(url) {
        this.props.history.push(url)
    }

    render() {
        return (
            <>
                <SiteHelm
                    url="https://pogpvp.com/pve/common"
                    header={strings.pageheaders.common}
                    descr={strings.pagedescriptions.common}
                />
                <div className=" container-fluid m-0 p-0 pt-2 pt-md-2 mb-5">
                    <div className="row  mx-0 mx-lg-2 justify-content-center">
                        {this.state.loading && <div className="col-12 m-0 p-0  mb-4"  >
                            <Loader
                                color="white"
                                weight="500"
                                locale={strings.tips.loading}
                                loading={this.state.loading}

                                class={"row m-0 p-0 justify-content-center"}
                                innerClass={"col-auto p-4 ml-1 mx-lg-0 mt-1  mt-md-2"}
                            />
                        </div>}
                        <div className="col-12 m-0 p-0 px-1">
                            {(this.state.isLoaded && (this.props.match.params.type === "common")) && <CommonPve
                                changeUrl={this.changeUrl}
                                parentState={this.state}
                            />}
                        </div>

                        <div className="col-12 veryBig results m-0 p-0 px-3 py-2" >
                            <DropWithArrow
                                onShow={this.onClick}
                                show={this.state.showCollapse}
                                title={strings.title.about}
                                elem={(this.state.isLoaded && (this.props.match.params.type === "common")) && <CommonDescr />}

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

export default PvePage