import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm"
import LocalizedStrings from "react-localization";
import { connect } from "react-redux"

import { getMoveBase } from "../../AppStore/Actions/getMoveBase"
import { getPokemonBase } from "../../AppStore/Actions/getPokemonBase"
import { getCustomMoves } from "../../AppStore/Actions/getCustomMoves"
import { refresh } from "../../AppStore/Actions/refresh"
import {
    extractRaidData, returnMovePool, returnPokList, separateMovebase, extractPveObj, extractPveBoss, extractPveAttacker
} from "../../js/indexFunctions"
import { getCookie } from "../../js/getCookie"
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
                weather: [
                    {},
                    { 10: 1.2, 9: 1.2, 6: 1.2, },
                    { 0: 1.2, 3: 1.2, 17: 1.2, },
                    { 15: 1.2, 12: 1.2, },
                    { 13: 1.2, 4: 1.2, 5: 1.2, },
                    { 14: 1.2, 7: 1.2, 2: 1.2, },
                    { 16: 1.2, 11: 1.2, },
                    { 8: 1.2, 1: 1.2, },
                ],
                friend: [1.0, 1.03, 1.05, 1.07, 1.1, 1.06, 1.12, 1.18, 1.25,],
                hp: [600, 1800, 3600, 9000, 15000, 22500,],
                timer: [180, 180, 180, 180, 300, 300,],
                mult: [0.5974, 0.67, 0.73, 0.79, 0.79, 0.79,],
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
            this.props.match.params.supp,
        )
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.attacker === prevProps.match.params.attacker &&
            this.props.match.params.boss === prevProps.match.params.boss &&
            this.props.match.params.obj === prevProps.match.params.obj &&
            this.props.match.params.supp === prevProps.match.params.supp) {
            return
        }
        if (this.props.history.action === "PUSH") {
            return
        }
        this.updateState(
            this.props.match.params.attacker,
            this.props.match.params.boss,
            this.props.match.params.obj,
            this.props.match.params.supp,
        )
    }



    async updateState(party, boss, obj, supp) {
        this.setState({
            loading: true,
        })
        let extrData = extractRaidData(party, boss, obj, supp)
        //after opening the page get pokemonBase

        console.log(extrData.attackerObj, extrData.bossObj, extrData.pveObj)
        await this.props.refresh()
        try {
            let fetches = [
                this.props.getPokemonBase(),
                this.props.getMoveBase(),
                this.props.getCustomMoves()
            ]
            if (extrData.attackerObj !== undefined && extrData.bossObj !== undefined && extrData.pveObj !== undefined) {
                fetches.push(fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST :
                    process.env.REACT_APP_PRERENDER) + window.location.pathname.replace("pve", "request"), {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                }))
            }

            let responses = await Promise.all(fetches)

            if (extrData.attackerObj !== undefined && extrData.bossObj !== undefined && extrData.pveObj !== undefined) {
                var pveResult = await responses[responses.length - 1].json()
            }

            let pokList = []
            if (!!this.props.bases.pokemonBase) { pokList = returnPokList(this.props.bases.pokemonBase, true, strings.options.moveSelect.none) }

            let mergedMovebase = { ...this.props.customMoves.moves, ...this.props.bases.moveBase }
            let movebaseSeparated = []
            if (!!this.props.bases.moveBase) { movebaseSeparated = separateMovebase(mergedMovebase) }


            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) {
                    this.setState({
                        isError: true,
                        error: i <= 1 ? this.props.bases.error : (i === 2 ? this.props.customMoves.error : pveResult.detail),
                        isLoaded: true,
                        showResult: false,
                        loading: false,

                        pokemonTable: (!!this.props.bases.pokemonBase) ? this.props.bases.pokemonBase : [],
                        moveTable: (!!this.props.bases.moveBase) ? mergedMovebase : [],
                        pokList: (pokList) ? pokList : [],
                        chargeMoveList: (movebaseSeparated.chargeMoveList) ? movebaseSeparated.chargeMoveList : [],
                        quickMoveList: (movebaseSeparated.quickMoveList) ? movebaseSeparated.quickMoveList : [],
                    })
                    return
                }
            }

            if (extrData.attackerObj !== undefined) {
                var attackerObj = this.setUpPokemon(extractPveAttacker(extrData.attackerObj), this.props.bases.pokemonBase)
            }
            if (extrData.bossObj !== undefined) {
                var bossObj = this.setUpPokemon(extractPveBoss(extrData.bossObj), this.props.bases.pokemonBase, true)
            }
            if (extrData.pveObj !== undefined) {
                var pveObj = extractPveObj(extrData.pveObj)
            }
            if (extrData.supportPokemon !== undefined) {
                var supportPokemon = this.setUpPokemon(extractPveAttacker(extrData.supportPokemon), this.props.bases.pokemonBase)
            }
            this.setState({
                attackerObj: attackerObj,
                bossObj: bossObj,
                pveObj: pveObj,
                supportPokemon: supportPokemon,

                date: (!!pveResult) ? Date.now() : 1,
                pveResult: pveResult,
                showResult: !!pveResult,
                url: window.location.href,

                pokemonTable: this.props.bases.pokemonBase,
                moveTable: mergedMovebase,
                pokList: pokList,
                chargeMoveList: movebaseSeparated.chargeMoveList,
                quickMoveList: movebaseSeparated.quickMoveList,
                isLoaded: true,
                loading: false,
            })

        } catch (e) {
            this.setState({
                isError: true,
                error: String(e),
                isLoaded: true,
                showResult: false,
                loading: false,

                pokemonTable: [],
                moveTable: [],
                pokList: [],
                chargeMoveList: [],
                quickMoveList: [],
            })
        }
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
                    <div className="row mx-0 mx-lg-2 justify-content-center">
                        {this.state.loading && <div className="col-12 p-0 mb-4"  >
                            <Loader
                                color="white"
                                weight="500"
                                locale={strings.tips.loading}
                                loading={this.state.loading}

                                class={"row m-0 justify-content-center"}
                                innerClass={"col-auto p-4 ml-1 mx-lg-0 mt-1  mt-md-2"}
                            />
                        </div>}
                        <div className="col-12 px-1">
                            {(this.state.isLoaded && (this.props.match.params.type === "common")) && <CommonPve
                                changeUrl={this.changeUrl}
                                parentState={this.state}
                            />}
                        </div>

                        <div className="max1000 col-12 col-md-10 col-lg-6 results px-3 py-2" >
                            <DropWithArrow
                                onShow={this.onClick}
                                show={this.state.showCollapse}
                                title={strings.title.about}
                                elem={(this.state.isLoaded && (this.props.match.params.type === "common")) &&
                                    <CommonDescr />}

                                faOpened="align-self-center fas fa-angle-up fa-lg "
                                faClosed="align-self-center fas fa-angle-down fa-lg"
                                outClass="row justify-content-between m-0 pb-1 clickable"
                                inClass="row justify-content-center m-0" />
                        </div>
                    </div>
                </div >
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        getCustomMoves: () => dispatch(getCustomMoves()),
        getPokemonBase: () => dispatch(getPokemonBase()),
        getMoveBase: () => dispatch(getMoveBase()),
    }
}

export default connect(
    state => ({
        customMoves: state.customMoves,
        bases: state.bases,
    }), mapDispatchToProps
)(PvePage)