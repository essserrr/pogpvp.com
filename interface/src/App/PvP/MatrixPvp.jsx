import React from "react";
import LocalizedStrings from "react-localization";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import { withStyles } from "@material-ui/core/styles";

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import Button from "App/Components/Button/Button";
import AdvisorCombinator from "./components/Advisor/AdvisorCombinator/AdvisorCombinator";
import TableBodyRender from "./components/TableBodyRender/TableBodyRender";
import { addParty } from "AppStore/Actions/actions";
import { deleteParty } from "AppStore/Actions/actions";
import MatrixPanel from "./components/MatrixPanel";
import Result from "./components/Result";
import EditPokemon from "./components/EditPokemon";

import { translareMove, translateName } from "App/Userpage/CustomPokemon/translator";
import { encodeQueryData } from "js/encoders/encodeQueryData";
import { capitalizeFirst } from "js/capitalizeFirst";
import { calculateMaximizedStats } from "js/Maximizer/Maximizer";
import { great, greatPremier, ultra, ultraPremier, master, masterPremier } from "./matrixPresets";


import { getCookie } from "js/getCookie";
import { pvp } from "locale/Pvp/Pvp";
import { options } from "locale/Components/Options/locale";

const styles = theme => ({
    matrixPanel: {
        maxWidth: "208px",
        minWidth: "208px",
    },
    middleRow: {
        maxWidth: "calc(100% - 416px) !important",
        [theme.breakpoints.down('sm')]: {
            maxWidth: "100% !important",
        }
    },
    overflowCont: {
        overflowX: "auto",
        overflowY: "auto",
        width: "100%",
        maxHeight: "483px",
    }
});


let optionStrings = new LocalizedStrings(options)
let strings = new LocalizedStrings(pvp)
const maxLevel = 40;

class MatrixPvp extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            leftPanel: {
                Shields: 0,
                IsGreedy: true,
                AtkStage: 0,
                DefStage: 0,
                maximizer: {
                    stat: "Overall",
                    level: String(maxLevel),
                    action: "Default",
                },

                showPokSelect: false,
                showSavePanel: false,
                showImportExportPanel: false,

                listForBattle: [],

                selectedParty: "",
            },
            rightPanel: {
                Shields: 0,
                IsGreedy: true,
                AtkStage: 0,
                DefStage: 0,
                maximizer: {
                    stat: "Overall",
                    level: String(maxLevel),
                    action: "Default",
                },

                showPokSelect: false,
                showSavePanel: false,
                showImportExportPanel: false,

                listForBattle: [],

                selectedParty: "",
            },
            savedParties: this.readParties(),

            redact: {
                showMenu: false,
            },

            triple: false,
            advDisabled: true,
            showAdvisor: false,

            loading: false,
            error: props.parentState.error,
            showResult: props.parentState.showResult,
            isError: props.parentState.isError,
        };

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPokemonAdd = this.onPokemonAdd.bind(this);
        this.onPokemonDelete = this.onPokemonDelete.bind(this);

        this.onImport = this.onImport.bind(this)
        this.onPartySave = this.onPartySave.bind(this);
        this.onPokRedact = this.onPokRedact.bind(this);
        this.onPokRedactOff = this.onPokRedactOff.bind(this);
        this.onRedactSubmit = this.onRedactSubmit.bind(this);
        this.onAdvisorSubmit = this.onAdvisorSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.parentState.league === prevProps.parentState.league) {
            return
        }
        this.statMaximizer({ target: { name: "", value: "" } }, "rightPanel")
        this.statMaximizer({ target: { name: "", value: "" } }, "leftPanel")
    }

    statMaximizer(event, role) {
        const max = {
            ...this.state[role].maximizer,
            [event.target.name]: event.target.value,
        }

        let newBattleList = this.state[role].listForBattle.map((pok) => {
            const ivSet = calculateMaximizedStats(
                pok.name,
                max.level,
                this.props.pokemonTable,
                {
                    great: this.props.parentState.league === "great",
                    ultra: this.props.parentState.league === "ultra",
                    master: this.props.parentState.league === "master",
                });
            const whatToMaximize = max.action === "Default" ? "Default" : max.stat;
            const selectedSet = ivSet[this.props.parentState.league][whatToMaximize];

            return {
                ...pok,
                Lvl: selectedSet.Level,
                Atk: selectedSet.Atk,
                Def: selectedSet.Def,
                Sta: selectedSet.Sta,
            }
        });

        this.setState({
            [role]: {
                ...this.state[role],
                listForBattle: newBattleList,
                maximizer: max,
            }
        });
    }

    readParties() {
        let partiesList = [
            <MenuItem value="" key="">{optionStrings.options.moveSelect.none}</MenuItem>,
            <MenuItem value="Preset1" key="Preset1">{optionStrings.options.matrixpreset.great}</MenuItem>,
            <MenuItem value="Preset2" key="Preset2">{optionStrings.options.matrixpreset.ultra}</MenuItem>,
            <MenuItem value="Preset3" key="Preset3">{optionStrings.options.matrixpreset.master}</MenuItem>,
            <MenuItem value="Preset4" key="Preset4">{optionStrings.options.matrixpreset.great + optionStrings.options.matrixpreset.pr}</MenuItem>,
            <MenuItem value="Preset5" key="Preset5">{optionStrings.options.matrixpreset.ultra + optionStrings.options.matrixpreset.pr}</MenuItem>,
            <MenuItem value="Preset6" key="Preset6">{optionStrings.options.matrixpreset.master + optionStrings.options.matrixpreset.pr}</MenuItem>,
            ...Object.keys(this.props.parties.parties).map((key) => <MenuItem value={key} key={key}>{key}</MenuItem>)
        ]
        return partiesList
    }

    onPopup(name, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [name]: true,
            }
        });
    }

    onPartyDelete(role) {
        let key = this.state[role].selectedParty
        if (key === "") { return }
        //delete entry
        this.props.deleteParty(key)
        //make new parties list
        let newParties = this.state.savedParties.filter((value) => value.key !== key)
        //make new key list of saved parties
        let keysList = Object.keys(this.props.parties.parties).filter((value) => value !== key)

        //create update variables
        let selectedLeft = this.state.leftPanel.selectedParty
        let selectedRight = this.state.rightPanel.selectedParty

        let listForBattleLeft = this.state.leftPanel.listForBattle
        let listForBattleRight = this.state.rightPanel.listForBattle

        //check if there some user created parties remained
        switch (keysList.length > 0) {
            case true:
                //if left panel has been affected redefine active party
                if (selectedLeft === key) {
                    selectedLeft = keysList[0]
                    listForBattleLeft = [...this.props.parties.parties[keysList[0]]]
                }
                //if right panel has been affected redefine active party
                if (selectedRight === key) {
                    selectedRight = keysList[0]
                    listForBattleRight = [...this.props.parties.parties[keysList[0]]]
                }
                break
            //if none parties remained, erase active values
            default:
                //if left panel has been affected redefine active party
                if (selectedLeft === key) {
                    selectedLeft = ""
                    listForBattleLeft = []
                }
                //if right panel has been affected redefine active party
                if (selectedRight === key) {
                    selectedRight = ""
                    listForBattleRight = []
                }
        }

        this.setState({
            savedParties: newParties,
            leftPanel: {
                ...this.state.leftPanel,
                selectedParty: selectedLeft,
                listForBattle: listForBattleLeft,
            },
            rightPanel: {
                ...this.state.rightPanel,
                selectedParty: selectedRight,
                listForBattle: listForBattleRight,
            }
        })
    }

    onPartySelect(event, role) {
        switch (true) {
            case event.target.value === "Preset1":
                var newListForBattle = great.map(pok => Object.assign({}, pok));
                break
            case event.target.value === "Preset2":
                newListForBattle = ultra.map(pok => Object.assign({}, pok));
                break
            case event.target.value === "Preset3":
                newListForBattle = master.map(pok => Object.assign({}, pok));
                break
            case event.target.value === "Preset4":
                newListForBattle = greatPremier.map(pok => Object.assign({}, pok));
                break
            case event.target.value === "Preset5":
                newListForBattle = ultraPremier.map(pok => Object.assign({}, pok));
                break
            case event.target.value === "Preset6":
                newListForBattle = masterPremier.map(pok => Object.assign({}, pok));
                break
            default:
                newListForBattle = [...this.props.parties.parties[event.target.value]]
                break
        }

        if (!newListForBattle) {
            return
        }

        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                listForBattle: newListForBattle,
            }
        });

    }

    onImport(obj) {
        let listForBattle = this.extractPokemon(obj.value.split("\n"), obj.attr)
        this.setState({
            [obj.attr]: {
                ...this.state[obj.attr],
                listForBattle: listForBattle,
                showImportExportPanel: false,
            }
        });

    }

    extractPokemon(stringArray, role) {
        let pokArr = []
        stringArray.forEach((value) => {
            let pok = value.split(",")

            if (!pok[0]) { return }

            let nameAndType = pok[0].split("!")
            let name = capitalizeFirst(nameAndType[0].replace("_", " "), true)
            name = translateName(name)
            if (!this.props.pokemonTable[name]) {
                console.log(`Critical: "${name}" not found in the database`)
                return
            }

            let QuickMove = ""
            if (!!pok[1]) {
                QuickMove = capitalizeFirst(pok[1].replace("_", " "), true)
                QuickMove = translareMove(QuickMove)
                if (!this.props.parentState.moveTable[QuickMove]) {
                    console.log(`Critical: "Quick move "${QuickMove}" of ${name} not found in the database`)
                    return
                }
            }

            let ChargeMove1 = ""
            if (!!pok[2]) {
                ChargeMove1 = capitalizeFirst(pok[2].replace("_", " "), true)
                ChargeMove1 = translareMove(ChargeMove1)
                if (!this.props.parentState.moveTable[ChargeMove1]) {
                    ChargeMove1 = ""
                    console.log(`Critical: "First charge move "${ChargeMove1}" of ${name} not found in the database`)
                }
            }

            let ChargeMove2 = ""
            if (!!pok[3]) {
                ChargeMove2 = capitalizeFirst(pok[3].replace("_", " "), true)
                ChargeMove2 = translareMove(ChargeMove2)
                if (!this.props.parentState.moveTable[ChargeMove2]) {
                    ChargeMove2 = ""
                    console.log(`Critical: "Second charge move "${ChargeMove2}" of ${name} not found in the database`)
                }
            }


            let ivSet = calculateMaximizedStats(name, this.state[role].maximizer.level, this.props.pokemonTable,
                {
                    great: this.props.parentState.league === "great" ? true : false,
                    ultra: this.props.parentState.league === "ultra" ? true : false,
                    master: this.props.parentState.league === "master" ? true : false
                })
            let whatToMaximize = (this.state[role].maximizer.action === "Default") ? "Default" : this.state[role].maximizer.stat

            pokArr.push({
                name, QuickMove, ChargeMove1, ChargeMove2,

                Lvl: ivSet[this.props.parentState.league][whatToMaximize].Level,
                Atk: ivSet[this.props.parentState.league][whatToMaximize].Atk,
                Def: ivSet[this.props.parentState.league][whatToMaximize].Def,
                Sta: ivSet[this.props.parentState.league][whatToMaximize].Sta,

                Shields: String(this.state[role].Shields), AtkStage: String(this.state[role].AtkStage), DefStage: String(this.state[role].DefStage),
                InitialHP: "0", InitialEnergy: "0", IsGreedy: String(this.state[role].IsGreedy), IsShadow: nameAndType.length > 1 ? "true" : "false",
            })

        })

        return pokArr
    }


    onChange(event, attributes, eventItem, ...other) {
        const { attr, name, category } = attributes

        if (category === "defaultStatMaximizer") {
            this.statMaximizer(event, attr)
            return
        }

        if (name === "showPokSelect" || name === "showSavePanel" || name === "showImportExportPanel") {
            this.onPopup(name, attr)
            return
        }

        if (name === "Delete") {
            this.onPartyDelete(attr)
            return
        }

        if (name === "selectedParty") {
            this.onPartySelect(event, attr)
            return
        }

        if (name === "triple") {
            this.setState({ triple: eventItem });
            return
        }

        let newBattleList = this.state[attr].listForBattle.map(pok => ({ ...pok, [event.target.name]: event.target.value }));

        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: event.target.value,
                listForBattle: newBattleList,
            },

        });
    }

    onClick(event, attributes) {
        this.setState({
            [attributes.attr]: {
                ...this.state[attributes.attr],
                showPokSelect: false,
                showSavePanel: false,
                showImportExportPanel: false,
            }
        });
    }

    onPokemonDelete(event, attributes) {
        const { name, attr } = attributes;
        const newListForBattle = [...this.state[attr].listForBattle.slice(0, name), ...this.state[attr].listForBattle.slice(name + 1)];

        this.setState({
            [attr]: {
                ...this.state[attr],
                listForBattle: newListForBattle,
            }
        });
    }

    submitForm = async event => {
        event.preventDefault();
        for (let i = 0; i < this.state.leftPanel.listForBattle.length; i++) {
            this.state.leftPanel.listForBattle[i].Query = decodeURIComponent(encodeQueryData(this.state.leftPanel.listForBattle[i]))
        }
        for (let i = 0; i < this.state.rightPanel.listForBattle.length; i++) {
            this.state.rightPanel.listForBattle[i].Query = decodeURIComponent(encodeQueryData(this.state.rightPanel.listForBattle[i]))
        }

        let snapshot = {
            advDisabled: this.state.leftPanel.listForBattle.length > 15 || this.state.leftPanel.listForBattle.length < 3
                || this.state.rightPanel.listForBattle.length > 50 || this.state.rightPanel.listForBattle.length < 1,
            triple: this.state.triple,
            pvpoke: this.props.parentState.pvpoke,
            league: this.props.parentState.league,
            leftPanel: this.state.leftPanel,
            rightPanel: this.state.rightPanel,
        }

        this.setState({
            advDisabled: true,
            loading: true,
        })

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/matrix", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                    "Pvp-Type": snapshot.pvpoke ? "pvpoke" : "normal",
                    "Pvp-Shields": snapshot.triple ? "triple" : "normal",
                },
                body: JSON.stringify({ Party1: this.state.leftPanel.listForBattle, Party2: this.state.rightPanel.listForBattle, })
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.setState({
                showResult: true,
                showAdvisor: false,
                isError: false,
                loading: false,
                pvpData: result,

                snapshot: snapshot,
                triple: snapshot.triple,
                advDisabled: snapshot.advDisabled,
            })

        } catch (e) {
            this.setState({
                advDisabled: true,
                showResult: false,
                showAdvisor: false,
                isError: true,
                loading: false,
                error: String(e),
                snapshot: undefined,
            })
        }
    }

    onPokemonAdd(event) {
        if (this.state[event.attr].listForBattle.length >= 50) {
            return
        }
        let key = this.uuidv4()
        let pokCopy = {
            name: String(event.pokemon.name), Lvl: String(event.pokemon.Lvl),
            Atk: String(event.pokemon.Atk), Def: String(event.pokemon.Def), Sta: String(event.pokemon.Sta),
            Shields: String(event.pokemon.Shields),
            AtkStage: String(event.pokemon.AtkStage), DefStage: String(event.pokemon.DefStage),
            InitialHP: String(event.pokemon.InitialHP), InitialEnergy: String(event.pokemon.InitialEnergy),
            IsGreedy: String(event.pokemon.IsGreedy), IsShadow: String(event.pokemon.IsShadow),
            QuickMove: String(event.pokemon.QuickMove), ChargeMove1: String(event.pokemon.ChargeMove1), ChargeMove2: String(event.pokemon.ChargeMove2),
            key: key,
        }


        pokCopy.key = key

        let newListForBattle = [...this.state[event.attr].listForBattle]
        newListForBattle.push(pokCopy);

        this.setState({
            [event.attr]: {
                ...this.state[event.attr],
                listForBattle: newListForBattle,
            }
        });
    }

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
        );
    }

    onPartySave(event) {
        if (!this.props.parties.parties[event.value]) {
            var newList = [...this.state.savedParties]
            newList.push(<MenuItem value={event.value} key={event.value}>{event.value}</MenuItem>)
            this.setState({
                savedParties: newList,
                [event.attr]: {
                    ...this.state[event.attr],
                    showPokSelect: false,
                    showSavePanel: false,
                },
            })

            this.props.addParty({ [event.value]: this.state[event.attr].listForBattle })
            return
        }

        this.setState({
            [event.attr]: {
                ...this.state[event.attr],
                showPokSelect: false,
                showSavePanel: false,
            }
        })

        this.props.addParty({ [event.value]: this.state[event.attr].listForBattle })
    }

    onPokRedact(event, attributes) {
        const { name, attr } = attributes;

        this.setState({
            redact: {
                ...this.state.redact,
                showMenu: true,
                attr: attr,
                number: Number(name),
                pokemon: this.state[attr].listForBattle[name],
            }
        })

    }

    onPokRedactOff(event) {
        this.setState({
            redact: {
                showMenu: false,
            }
        })
    }

    onRedactSubmit(event) {
        let pokCopy = {
            name: String(event.pokemon.name), Lvl: String(event.pokemon.Lvl),
            Atk: String(event.pokemon.Atk), Def: String(event.pokemon.Def), Sta: String(event.pokemon.Sta),
            Shields: String(event.pokemon.Shields),
            AtkStage: String(event.pokemon.AtkStage), DefStage: String(event.pokemon.DefStage),
            InitialHP: String(event.pokemon.InitialHP), InitialEnergy: String(event.pokemon.InitialEnergy),
            IsGreedy: String(event.pokemon.IsGreedy), IsShadow: String(event.pokemon.IsShadow),
            QuickMove: String(event.pokemon.QuickMove), ChargeMove1: String(event.pokemon.ChargeMove1), ChargeMove2: String(event.pokemon.ChargeMove2),
            key: event.pokemon.name + this.state.redact.number,
        }

        let newListForBattle = [...this.state[this.state.redact.attr].listForBattle]
        newListForBattle[this.state.redact.number] = pokCopy

        this.setState({
            [this.state.redact.attr]: {
                ...this.state[this.state.redact.attr],
                listForBattle: newListForBattle,
            },
            redact: {
                showMenu: false,
            },
        })

    }

    onAdvisorSubmit() {
        this.setState({
            showAdvisor: true,
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="space-between" spacing={1}>

                {this.state.redact.showMenu &&
                    <EditPokemon
                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.parentState.moveTable}
                        userPokemon={this.props.userPokemon}

                        pokList={this.props.parentState.pokList}
                        quickMoveList={this.props.parentState.quickMoveList}
                        chargeMoveList={this.props.parentState.chargeMoveList}

                        league={this.props.parentState.league}

                        value={this.state[this.state.redact.attr]}

                        redact={this.state.redact}

                        onClick={this.onPokRedactOff}
                        onPokemonAdd={this.onRedactSubmit}
                    />}

                <Box clone order={{ xs: 1 }}>
                    <Grid item xs="auto" className={classes.matrixPanel}>
                        <MatrixPanel
                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            userPokemon={this.props.userPokemon}

                            pokList={this.props.parentState.pokList}
                            quickMoveList={this.props.parentState.quickMoveList}
                            chargeMoveList={this.props.parentState.chargeMoveList}
                            savedParties={this.state.savedParties}

                            league={this.props.parentState.league}

                            enableCheckbox={true}
                            triple={this.state.triple}
                            advDisabled={this.state.advDisabled}
                            onAdvisorSubmit={this.onAdvisorSubmit}

                            value={this.state.leftPanel}

                            attr="leftPanel"
                            onChange={this.onChange}
                            onClick={this.onClick}
                            onPokemonAdd={this.onPokemonAdd}
                            onPokRedact={this.onPokRedact}
                            onPokemonDelete={this.onPokemonDelete}

                            onPartySave={this.onPartySave}
                            onImport={this.onImport}
                        />
                    </Grid>
                </Box>

                <Box className={classes.middleRow} clone order={{ xs: 3, md: 2 }}>
                    <Grid item xs={12} md>
                        <Grid container spacing={1} style={{ height: "100%" }} alignItems="flex-end">

                            {this.state.showResult && this.state.pvpData && this.state.snapshot &&
                                <Box clone order={{ xs: 2, md: 1 }} alignSelf="flex-start">
                                    <Grid item xs={12}>
                                        <GreyPaper elevation={4} enablePadding paddingMult={1}>
                                            <Grid item xs={12} className={classes.overflowCont}>
                                                <Result enableFocus>
                                                    <TableBodyRender
                                                        pvpData={this.state.pvpData}
                                                        pvpoke={this.state.snapshot.pvpoke ? "/pvpoke" : ""}

                                                        isTriple={this.state.snapshot.triple}
                                                        league={this.state.snapshot.league}

                                                        pokemonTable={this.props.pokemonTable}
                                                        moveTable={this.props.parentState.moveTable}

                                                        leftPanel={this.state.snapshot.leftPanel}
                                                        rightPanel={this.state.snapshot.rightPanel}
                                                    />
                                                </Result>
                                            </Grid>
                                        </GreyPaper>
                                    </Grid>
                                </Box>}

                            < Box clone order={{ xs: 1, md: 2 }} alignSelf="flex-end" >
                                <Grid item xs={12} container alignItems="center">

                                    <Grid item xs={12} container alignItems="center" wrap="nowrap">
                                        <Grid item xs container justify="center">
                                            <Button
                                                loading={this.state.loading}
                                                title={strings.buttons.calculate}
                                                onClick={this.submitForm}
                                                endIcon={<i className="fa fa-calculator" aria-hidden="true"></i>}
                                            />
                                        </Grid>
                                    </Grid>

                                    {this.state.isError &&
                                        <Box clone mt={1}>
                                            <Grid item xs={12}>
                                                <Alert variant="filled" severity="error">{this.state.error}</Alert >
                                            </Grid>
                                        </Box>}

                                </Grid>
                            </Box >

                        </Grid >
                    </Grid>
                </Box>

                <Box clone order={{ xs: 2, md: 3 }}>
                    <Grid item xs="auto" className={classes.matrixPanel}>
                        <MatrixPanel
                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            userPokemon={this.props.userPokemon}

                            pokList={this.props.parentState.pokList}
                            quickMoveList={this.props.parentState.quickMoveList}
                            chargeMoveList={this.props.parentState.chargeMoveList}
                            savedParties={this.state.savedParties}

                            league={this.props.parentState.league}

                            value={this.state.rightPanel}
                            attr="rightPanel"
                            onChange={this.onChange}
                            onClick={this.onClick}
                            onPokemonAdd={this.onPokemonAdd}
                            onPokRedact={this.onPokRedact}
                            onPokemonDelete={this.onPokemonDelete}

                            onPartySave={this.onPartySave}
                            onImport={this.onImport}
                        />
                    </Grid>
                </Box>

                {!this.state.advDisabled && this.state.snapshot && this.state.showAdvisor &&
                    <Box clone order={{ xs: 6 }}>
                        <Grid item xs={12} container justify="center">
                            <Grid item xs={12} sm={9} md={7} lg={6}>
                                <AdvisorCombinator
                                    pvpData={this.state.pvpData}
                                    pvpoke={this.state.snapshot.pvpoke ? "/pvpoke" : ""}

                                    isTriple={this.state.snapshot.triple}

                                    league={this.state.snapshot.league}

                                    pokemonTable={this.props.pokemonTable}
                                    moveTable={this.props.parentState.moveTable}

                                    leftPanel={this.state.snapshot.leftPanel}
                                    rightPanel={this.state.snapshot.rightPanel}
                                />
                            </Grid>
                        </Grid>
                    </Box>}
            </Grid>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        addParty: (value) => dispatch(addParty(value)),
        deleteParty: (value) => dispatch(deleteParty(value)),
    }
}

export default withStyles(styles, { withTheme: true })(
    connect(
        state => ({
            parties: state.parties,
        }), mapDispatchToProps
    )(MatrixPvp)
);

MatrixPvp.propTypes = {
    userPokemon: PropTypes.arrayOf(PropTypes.object),
    pokemonTable: PropTypes.object,

    parentState: PropTypes.object,
};

