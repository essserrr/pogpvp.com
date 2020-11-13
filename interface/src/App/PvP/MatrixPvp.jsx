import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import Button from "App/Components/Button/Button";
import AdvisorCombinator from "./components/Advisor/AdvisorCombinator/AdvisorCombinator"
import TableBodyRender from "./components/TableBodyRender/TableBodyRender"
import { addParty } from "../../AppStore/Actions/actions"
import { deleteParty } from "../../AppStore/Actions/actions"
import MatrixPanel from "./components/MatrixPanel"


import { translareMove, translateName } from "../Userpage/CustomPokemon/translator"
import { encodeQueryData, calculateMaximizedStats, capitalizeFirst } from "../../js/indexFunctions.js"
import { getCookie } from "../../js/getCookie"
import { great, greatPremier, ultra, ultraPremier, master, masterPremier } from "./matrixPresets"
import Result from "./components/Result"
import RedactPokemon from "./components/RedactPokemon"

import "./MatrixPvp.scss"

import { locale } from "../../locale/locale"

let strings = new LocalizedStrings(locale)

class MatrixPvp extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            leftPanel: {
                Shields: 0,
                IsGreedy: true,
                AtkStage: 0,
                DefStage: 0,
                maximizer: {
                    stat: "Overall",
                    level: "40",
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
                    level: "40",
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
        let max = {
            ...this.state[role].maximizer,
            [event.target.name]: event.target.value,
        }

        let newBattleList = this.state[role].listForBattle.map((pok) => {
            let ivSet = calculateMaximizedStats(pok.name,
                max.level,
                this.props.pokemonTable,
                {
                    great: this.props.parentState.league === "great" ? true : false,
                    ultra: this.props.parentState.league === "ultra" ? true : false,
                    master: this.props.parentState.league === "master" ? true : false
                })
            let whatToMaximize = (max.action === "Default") ? "Default" : max.stat

            return Object.assign({}, pok, {
                Lvl: ivSet[this.props.parentState.league][whatToMaximize].Level,
                Atk: ivSet[this.props.parentState.league][whatToMaximize].Atk,
                Def: ivSet[this.props.parentState.league][whatToMaximize].Def,
                Sta: ivSet[this.props.parentState.league][whatToMaximize].Sta,
            })
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
            <option value="" key="">{""}</option>,
            <option value="Preset1" key="Preset1">{strings.options.matrixpreset.great}</option>,
            <option value="Preset2" key="Preset2">{strings.options.matrixpreset.ultra}</option>,
            <option value="Preset3" key="Preset3">{strings.options.matrixpreset.master}</option>,
            <option value="Preset4" key="Preset4">{strings.options.matrixpreset.great + strings.options.matrixpreset.pr}</option>,
            <option value="Preset5" key="Preset5">{strings.options.matrixpreset.ultra + strings.options.matrixpreset.pr}</option>,
            <option value="Preset6" key="Preset6">{strings.options.matrixpreset.master + strings.options.matrixpreset.pr}</option>,
            ...Object.keys(this.props.parties.parties).map((key) => <option value={key} key={key}>{key}</option>)
        ]
        return partiesList
    }

    onPopup(event, role) {
        event.preventDefault();
        let stat = event.target.getAttribute("stat")

        this.setState({
            [role]: {
                ...this.state[role],
                [stat]: true,
            }
        });
    }

    onPartyDelete(event, role) {
        let key = this.state[role].selectedParty
        if (key === "") {
            return
        }
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


    onChange(event) {
        //otherwise follow general pattern
        let action = event.target.getAttribute("action")
        let role = event.target.getAttribute("attr")
        if (action === "defaultStatMaximizer") {
            this.statMaximizer(event, role)
            return
        }
        if (action === "Add pokemon" || action === "Save" || action === "Import/Export") {
            this.onPopup(event, role)
            return
        }
        if (action === "Delete") {
            this.onPartyDelete(event, role)
            return
        }
        if (event.target.name === "selectedParty") {
            this.onPartySelect(event, role)
            return
        }
        if (event.target.name === "triple") {
            this.setState({ triple: !this.state.triple });
            return
        }

        let newBattleList = this.state[role].listForBattle.map(pok => Object.assign({}, pok, { [event.target.name]: event.target.value }));

        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                listForBattle: newBattleList,
            },

        });
    }

    onClick(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        let role = event.target.getAttribute("attr")
        this.setState({
            [role]: {
                ...this.state[role],
                showPokSelect: false,
                showSavePanel: false,
                showImportExportPanel: false,
            }
        });
    }

    onPokemonDelete(event) {
        let role = event.target.getAttribute("attr")
        let index = event.target.getAttribute("index")

        let newListForBattle = [...this.state[role].listForBattle.slice(0, index), ...this.state[role].listForBattle.slice(index + 1)]

        this.setState({
            [role]: {
                ...this.state[role],
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
            newList.push(<option value={event.value} key={event.value}>{event.value}</option>)
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

    onPokRedact(event) {
        if (event.target.getAttribute("name") === "closeButton") {
            return
        }
        let attr = event.currentTarget.getAttribute("attr")
        let index = event.currentTarget.getAttribute("index")

        this.setState({
            redact: {
                ...this.state.redact,
                showMenu: true,
                attr: attr,
                number: Number(index),
                pokemon: this.state[attr].listForBattle[index],
            }
        })

    }

    onPokRedactOff(event) {
        const name = event.target.name ? event.target.name : event.target.getAttribute("name")
        if (!(event.target === event.currentTarget) && name !== "closeButton") {
            return
        }
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
        return (
            < >
                <div className="row justify-content-between mb-4"  >
                    {this.state.redact.showMenu && <RedactPokemon
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
                    <div className="matrixpvp__results order-1 ml-1 mx-lg-0 mt-1  mt-md-2" >
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
                    </div>



                    <div className="matrixpvp--overflow order-3 order-lg-1 col-12 col-lg mt-0 mt-lg-2 mx-0 px-0" >
                        <div className="row mx-1 h-100"  >
                            {(this.state.showResult || this.state.isError) &&
                                <div className="matrixpvp__results align-self-start order-3 order-lg-1 col-12 mt-3 mt-lg-0 p-2 ">
                                    <div className="row justify-content-center mx-0"  >
                                        <div className="matrixpvp__overflow-cont order-2 p-0 mx-2 order-lg-1 col-12 ">
                                            {this.state.showResult && this.state.pvpData && this.state.snapshot &&
                                                <Result
                                                    class="matrixpvp__fixed-thead"
                                                    table={
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
                                                    }
                                                />}
                                            {this.state.isError &&
                                                <Alert variant="filled" severity="error">{this.state.error}</Alert >}
                                        </div>
                                    </div>
                                </div>}

                            {this.state.loading &&
                                <Grid item xs={12}>
                                    <LinearProgress color="secondary" />
                                </ Grid>}

                            <div className="align-self-end order-1 order-lg-3 col px-0">
                                <div className="order-2 order-lg-3 d-flex justify-content-center mx-0 px-0 col-12  mt-2 mt-lg-0" >
                                    <Button
                                        title={strings.buttons.letsbattle}
                                        onClick={this.submitForm}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="matrixpvp__results order-2 order-lg-3 mr-1 mx-lg-0 mt-1 mt-md-0 mt-md-2" >
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
                    </div>

                    {!this.state.advDisabled && this.state.snapshot && this.state.showAdvisor &&
                        <div className="order-6 col-12 p-1 pt-3" >
                            <div className="row mx-1 justify-content-center"  >
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
                            </div>
                        </div>}
                </div>
            </ >
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        addParty: (value) => dispatch(addParty(value)),
        deleteParty: (value) => dispatch(deleteParty(value)),
    }
}

export default connect(
    state => ({
        parties: state.parties,
    }), mapDispatchToProps
)(MatrixPvp)





