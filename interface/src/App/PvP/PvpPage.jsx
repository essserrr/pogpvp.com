import React from "react";
import SiteHelm from "../SiteHelm/SiteHelm";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import UpperPanel from "./components/UpperPanel/UpperPanel";
import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import DropWithArrow from "../PvpRating//DropWithArrow/DropWithArrow";

import { getCustomPokemon } from "AppStore/Actions/getCustomPokemon";
import { getMoveBase } from "AppStore/Actions/getMoveBase";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import { getCustomMoves } from "AppStore/Actions/getCustomMoves";
import { refresh } from "AppStore/Actions/refresh";
import SinglePvp from "./SinglePvp";
import MatrixPvp from "./MatrixPvp";
import MatrixDescr from "./components/Description/MatrixDescr";
import SingleDescr from "./components/Description/SingleDescr";

import { MovePoolBuilder } from "js/movePoolBuilder";
import { separateMovebase } from "js/separateMovebase";
import { returnPokList } from "js/returnPokList";

import { extractPokemon, extractData, calculateMaximizedStats, calculateEffStat } from "js/indexFunctions";
import { getCookie } from "js/getCookie";
import { pvp } from "locale/Pvp/Pvp";
import { options } from "locale/Components/Options/locale";

import "./PvpPage.scss"

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);

function setUpPokemon(pok, hisResult, pokemonTable) {
    pok.HP = hisResult.HP
    pok.Energy = hisResult.EnergyRemained

    let moves = new MovePoolBuilder();
    moves.createMovePool(pok.name, pokemonTable, optionStrings.options.moveSelect, false, [pok.QuickMove], [pok.ChargeMove1, pok.ChargeMove2])
    pok.quickMovePool = moves.quickMovePool
    pok.chargeMovePool = moves.chargeMovePool

    pok.ivSet = { 40: calculateMaximizedStats(pok.name, 40.0, pokemonTable) }
    pok.effAtk = calculateEffStat(pok.name, pok.Lvl, pok.Atk, pok.AtkStage, pokemonTable, "Atk", pok.IsShadow)
    pok.effDef = calculateEffStat(pok.name, pok.Lvl, pok.Def, pok.DefStage, pokemonTable, "Def", pok.IsShadow)
    pok.effSta = calculateEffStat(pok.name, pok.Lvl, pok.Sta, 0, pokemonTable, "Sta")

    return pok
}


class PvpPage extends React.Component {
    constructor() {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        this.state = {
            error: "",
            showResult: false,
            isError: false,
            moveTable: "",
            pokList: "",
            chargeMoveList: "",
            quickMoveList: "",
            league: "",
            pvpoke: false,


            isLoaded: false,
            loading: false,
        };
        this.onChange = this.onChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.onPvpokeEnable = this.onPvpokeEnable.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
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
        if (this.props.match.params.league === prevProps.match.params.league &&
            this.props.match.params.pok1 === prevProps.match.params.pok1 &&
            this.props.match.params.pok2 === prevProps.match.params.pok2 &&
            this.props.match.params.simtype === prevProps.match.params.simtype) {
            return
        }

        if (this.props.history.action === "PUSH" &&
            (this.props.location.state ?
                !this.props.location.state.needsUpdate : true)) {
            return
        }
        this.updateState(
            this.props.match.params.league,
            this.props.match.params.pok1,
            this.props.match.params.pok2,
            this.props.match.params.simtype,
        )
    }

    async updateState(league, pok1, pok2, simtype) {
        this.setState({
            loading: true,
            pvpoke: simtype === "pvpoke" ? true : false,
        })
        let extractedData = extractData(league, pok1, pok2)

        await this.props.refresh()
        try {
            let fetches = [
                this.props.getPokemonBase(),
                this.props.getMoveBase(),
                this.props.getCustomMoves(),
                this.props.getCustomPokemon(),
            ]
            if (extractedData.attacker !== undefined && extractedData.defender !== undefined) {
                fetches.push(fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + window.location.pathname.replace("pvp", "request").replace("/pvpoke", ""), {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json", "Accept-Encoding": "gzip", "Pvp-Type": simtype === "pvpoke" ? "pvpoke" : "normal",
                    },
                }))
            }

            let responses = await Promise.all(fetches)

            if (extractedData.attacker !== undefined && extractedData.defender !== undefined) {
                var pvpResult = await responses[responses.length - 1].json()
            }

            if (!!this.props.bases.pokemonBase) { var pokList = returnPokList(this.props.bases.pokemonBase) }

            let mergedMovebase = { ...this.props.customMoves.moves, ...this.props.bases.moveBase }
            if (!!this.props.bases.moveBase) { var movebaseSeparated = separateMovebase(mergedMovebase) }

            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) {
                    this.setState({
                        isError: true,
                        error: (i === 4 ? pvpResult.detail : responses[i].detail),
                        isLoaded: true,
                        showResult: false,
                        loading: false,
                        league: (extractedData.league) ? extractedData.league : "great",

                        moveTable: (!!this.props.bases.moveBase) ? mergedMovebase : [],
                        pokList: pokList,
                        chargeMoveList: movebaseSeparated.chargeMoveList,
                        quickMoveList: movebaseSeparated.quickMoveList,
                    })
                    return
                }
            }

            if (extractedData.attacker !== undefined) {
                var attacker = setUpPokemon(extractPokemon(extractedData.attacker), (pvpResult) ? pvpResult.Attacker : {}, this.props.bases.pokemonBase)
            }
            if (extractedData.defender !== undefined) {
                var defender = setUpPokemon(extractPokemon(extractedData.defender), (pvpResult) ? pvpResult.Defender : {}, this.props.bases.pokemonBase)
            }
            this.setState({
                attacker: attacker,
                defender: defender,
                pvpResult: pvpResult,
                showResult: !!pvpResult,
                url: (extractedData.attacker !== undefined && extractedData.defender !== undefined) ? window.location.href : "",
                league: (extractedData.league) ? extractedData.league : "great",

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
                league: (extractedData.league) ? extractedData.league : "great",

                moveTable: [],
                pokList: [],
                chargeMoveList: [],
                quickMoveList: [],
            })
        }
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

    changeUrl(url) {
        this.props.history.push(url)
    }


    render() {
        const isMatrix = this.props.match.params.type === "matrix";
        const isSingle = this.props.match.params.type === "single";
        return (
            <Grid container justify="center">
                <SiteHelm
                    url={isMatrix ? "https://pogpvp.com/pvp/matrix" :
                        "https://pogpvp.com/pvp/single"}
                    header={isMatrix ? strings.pageheaders.matrix : strings.pageheaders.single}
                    descr={isMatrix ? strings.pagedescriptions.matrix : strings.pagedescriptions.single}
                />

                <Grid item xs={12} lg={11} container justify="center" spacing={3} >

                    <Grid item xs={12} md={8}>
                        <GreyPaper elevation={4} enablePadding paddingMult={0.75}>
                            <DropWithArrow title={strings.title.about}>
                                {this.state.isLoaded && ((this.props.match.params.type === "matrix") ? <MatrixDescr /> : <SingleDescr />)}
                            </DropWithArrow>
                        </GreyPaper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <UpperPanel checked={Boolean(this.state.pvpoke)} league={this.state.league} onChange={this.onChange} onPvpokeEnable={this.onPvpokeEnable} />
                    </Grid>

                    {this.state.loading &&
                        <Grid item xs={12}>
                            <LinearProgress color="secondary" />
                        </ Grid>}

                    <Grid item xs={12}>
                        {this.state.isLoaded && isSingle &&
                            <SinglePvp
                                userPokemon={this.props.customPokemon}
                                pokemonTable={this.props.bases.pokemonBase}

                                parentState={this.state}
                                changeUrl={this.changeUrl} />}

                        {this.state.isLoaded && isMatrix &&
                            <MatrixPvp
                                userPokemon={this.props.customPokemon}
                                pokemonTable={this.props.bases.pokemonBase}

                                parentState={this.state} />}
                    </Grid>

                </Grid>
            </Grid>
        );
    }
};

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        getCustomMoves: () => dispatch(getCustomMoves()),
        getPokemonBase: () => dispatch(getPokemonBase()),
        getMoveBase: () => dispatch(getMoveBase()),
        getCustomPokemon: () => dispatch(getCustomPokemon()),
    }
};

export default connect(
    state => ({
        customMoves: state.customMoves,
        bases: state.bases,
        customPokemon: state.customPokemon.pokemon,
    }), mapDispatchToProps
)(PvpPage);
