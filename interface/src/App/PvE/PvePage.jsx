import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import CustomPve from "./CustomPve";
import CommonPve from "./CommonPve";
import DropWithArrow from "../PvpRating//DropWithArrow/DropWithArrow";
import CommonDescr from "./Components/Description/CommonDescr";

import { getCustomPokemon } from "AppStore/Actions/getCustomPokemon";
import { getMoveBase } from "AppStore/Actions/getMoveBase";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import { getCustomMoves } from "AppStore/Actions/getCustomMoves";
import { refresh } from "AppStore/Actions/refresh";

import { MovePoolBuilder } from "js/movePoolBuilder";
import { separateMovebase } from "js/separateMovebase";
import { returnPokList } from "js/returnPokList";

import { extractRaidData, extractPveObj, extractPveBoss, extractPveAttacker } from "js/indexFunctions";
import { getCookie } from "js/getCookie";
import { locale } from "locale/Pve/Pve";
import { options } from "locale/Components/Options/locale";

let strings = new LocalizedStrings(locale);
let optionStrings = new LocalizedStrings(options);

class PvePage extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
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
            moveTable: "",
            pokList: "",
            chargeMoveList: "",
            quickMoveList: "",

            isLoaded: false,
            loading: false,
        };
        this.updateState = this.updateState.bind(this);
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

        await this.props.refresh()
        try {
            let fetches = [
                this.props.getPokemonBase(),
                this.props.getMoveBase(),
                this.props.getCustomMoves(),
                this.props.getCustomPokemon(),
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

            if (!!this.props.bases.pokemonBase) { var pokList = returnPokList(this.props.bases.pokemonBase, true, optionStrings.options.moveSelect.none) }

            let mergedMovebase = { ...this.props.customMoves.moves, ...this.props.bases.moveBase }
            if (!!this.props.bases.moveBase) { var movebaseSeparated = separateMovebase(mergedMovebase) }


            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) {
                    this.setState({
                        isError: true,
                        error: (i === 3 ? pveResult.detail : responses[i].detail),
                        isLoaded: true,
                        showResult: false,
                        loading: false,

                        moveTable: !!this.props.bases.moveBase ? mergedMovebase : [],
                        pokList: pokList,
                        chargeMoveList: movebaseSeparated.chargeMoveList,
                        quickMoveList: movebaseSeparated.quickMoveList,
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

                moveTable: mergedMovebase,
                pokList: pokList,
                boostersList: pokList.filter((etry) => this.canBoost(etry.value)),

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

                moveTable: [],
                pokList: [],
                chargeMoveList: [],
                quickMoveList: [],
            })
        }
    }

    canBoost(name) {
        if (name.indexOf("Mega ") !== -1 || name.indexOf("Primal ") !== -1 || name.indexOf("Нет") !== -1 || name.indexOf("None") !== -1) {
            return true
        }
        return false
    }

    setUpPokemon(pok, pokemonTable, isBoss) {
        let moves = new MovePoolBuilder();
        moves.createMovePool(pok.Name, pokemonTable, optionStrings.options.moveSelect, isBoss, [pok.QuickMove], [pok.ChargeMove])
        pok.quickMovePool = moves.quickMovePool
        pok.chargeMovePool = moves.chargeMovePool
        return pok
    }

    changeUrl(url) {
        this.props.history.push(url)
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/pve/common"
                    header={strings.pageheaders.common}
                    descr={strings.pagedescriptions.common}
                />
                <Grid item sm={10} md={8} lg={6} container justify="center" spacing={3} >

                    {this.state.loading &&
                        <Grid item xs={12}>
                            <LinearProgress color="secondary" />
                        </ Grid>}

                    {((this.props.match.params.type === "custom" && !!getCookie("sid")) || this.props.match.params.type === "common") &&
                        <Grid item xs={12}>
                            <GreyPaper elevation={4} enablePadding paddingMult={0.75}>
                                <DropWithArrow title={strings.title.about}>
                                    <CommonDescr />
                                </DropWithArrow>
                            </GreyPaper>
                        </Grid>}

                    {this.state.isLoaded &&
                        <Grid item xs={12}>
                            {this.props.match.params.type === "common" &&
                                <CommonPve
                                    pokemonTable={this.props.bases.pokemonBase}

                                    changeUrl={this.changeUrl}
                                    parentState={this.state}
                                />}

                            {this.props.match.params.type === "custom" &&
                                <CustomPve
                                    pokemonTable={this.props.bases.pokemonBase}

                                    changeUrl={this.changeUrl}
                                    parentState={this.state}
                                    userParties={this.props.customParties}
                                />}
                        </Grid>}
                </Grid>
            </Grid>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        getCustomMoves: () => dispatch(getCustomMoves()),
        getPokemonBase: () => dispatch(getPokemonBase()),
        getMoveBase: () => dispatch(getMoveBase()),
        getCustomPokemon: () => dispatch(getCustomPokemon()),
    }
}

export default connect(
    state => ({
        customMoves: state.customMoves,
        bases: state.bases,
        customParties: state.customPokemon.parties,
    }), mapDispatchToProps
)(PvePage)