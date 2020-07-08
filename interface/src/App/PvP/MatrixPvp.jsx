import React from "react";
import LocalizedStrings from "react-localization";

import SubmitButton from "./components/SubmitButton/SubmitButton"
import MatrixPanel from "./components/MatrixPanel"
import Errors from "./components/Errors/Errors"
import ListEntry from "./components/MatrixPokemonList/ListEntry"
import Advisor from "./components/Advisor/Advisor"
import TheadElement from "./components/MetrixTable/TheadElement"
import LineElement from "./components/MetrixTable/LineElement"

import { encodeQueryData, getCookie, calculateMaximizedStats, returnRateStyle } from "../../js/indexFunctions.js"
import { great, ultra, master } from "./matrixPresets"
import Result from "./components/Result"
import RedactPokemon from "./components/RedactPokemon"
import PokemonIconer from "./components/PokemonIconer/PokemonIconer"
import Loader from "../PvpRating/Loader"


import { locale } from "../../locale/locale"

let strings = new LocalizedStrings(locale);


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

                listForBattle: [],
                listToDisplay: [],

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

                listForBattle: [],
                listToDisplay: [],

                selectedParty: "",
            },
            savedParties: this.readParties(),

            redact: {
                showMenu: false,
            },
            triple: false,
            advDisabled: true,
            advisorList: undefined,

            loading: false,
            error: this.props.parentState.error,
            showResult: this.props.parentState.showResult,
            isError: this.props.parentState.isError,


        };
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPokemonAdd = this.onPokemonAdd.bind(this);
        this.onPokemonDelete = this.onPokemonDelete.bind(this);
        this.onPartySave = this.onPartySave.bind(this);
        this.onPokRedact = this.onPokRedact.bind(this);
        this.onPokRedactOff = this.onPokRedactOff.bind(this);
        this.onRedactSubmit = this.onRedactSubmit.bind(this);
        this.makeTableLines = this.makeTableLines.bind(this);
        this.onAdvisorSubmit = this.onAdvisorSubmit.bind(this);
        this.addStar = this.addStar.bind(this);
    }


    statMaximizer(event, role) {
        event.persist()
        let max = { ...this.state[role].maximizer }
        max[event.target.name] = event.target.value

        let newBattleList = this.state[role].listForBattle.map((pok) => {
            let ivSet = calculateMaximizedStats(pok.name,
                max.level,
                this.props.parentState.pokemonTable,
                {
                    great: this.props.parentState.league === "great" ? true : false,
                    ultra: this.props.parentState.league === "ultra" ? true : false,
                    master: this.props.parentState.league === "master" ? true : false
                })
            let whatToMaximize = (max.action === "Default") ? "Default" : max.stat

            return Object.assign({}, pok, {
                "Lvl": ivSet[this.props.parentState.league][whatToMaximize].Level,
                "Atk": ivSet[this.props.parentState.league][whatToMaximize].Atk,
                "Def": ivSet[this.props.parentState.league][whatToMaximize].Def,
                "Sta": ivSet[this.props.parentState.league][whatToMaximize].Sta,
            })
        });

        this.setState({
            [role]: {
                ...this.state[role],
                listForBattle: newBattleList,
                maximizer: {
                    ...this.state[role].maximizer,
                    [event.target.name]: event.target.value,
                },
            }
        });

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
        event.preventDefault();
        let key = this.state[role].selectedParty
        if (key === "") {
            return
        }
        let newParties = this.state.savedParties.filter((value) => value.key !== key);
        localStorage.removeItem(key)
        this.setState({
            savedParties: newParties,
            leftPanel: {
                ...this.state.leftPanel,
                selectedParty: (localStorage.key(0) !== null) ? localStorage.key(0) : "",
            },
            rightPanel: {
                ...this.state.rightPanel,
                selectedParty: (localStorage.key(0) !== null) ? localStorage.key(0) : "",
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
            default:
                newListForBattle = JSON.parse(localStorage.getItem(event.target.value));
                break
        }

        if (!newListForBattle) {
            return
        }

        let currentListToDisplay = newListForBattle.map((elem, i) => {
            let key = elem.name + i
            newListForBattle[i].key = key
            return <ListEntry
                onPokemonDelete={this.onPokemonDelete}
                attr={role}
                onClick={this.onPokRedact}

                key={key}
                index={key}
                thead={<><PokemonIconer
                    src={this.props.parentState.pokemonTable[elem.name].Number +
                        (this.props.parentState.pokemonTable[elem.name].Forme !== "" ? "-" + this.props.parentState.pokemonTable[elem.name].Forme : "")}
                    class={"icon24 mr-1"}
                    for={""}
                />{elem.name}</>}
                body={
                    elem.QuickMove + this.addStar(elem.name, elem.QuickMove) +
                    (elem.ChargeMove1 ? " + " + elem.ChargeMove1 + this.addStar(elem.name, elem.ChargeMove1) : "") +
                    (elem.ChargeMove2 ? "/" + elem.ChargeMove2 + this.addStar(elem.name, elem.ChargeMove2) : "")
                }
            />
        });

        this.setState({
            advisorList: undefined,
            advDisabled: true,
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                listToDisplay: currentListToDisplay,
                listForBattle: newListForBattle,
            }
        });

    }

    onChange(event) {
        //otherwise follow general pattern
        let action = event.target.getAttribute("action")
        let role = event.target.getAttribute("attr")
        if (action === "defaultStatMaximizer") {
            this.statMaximizer(event, role)
            return
        }
        if (action === "Add pokemon" || action === "Save") {
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
            }
        });
    }

    onPokemonDelete(event) {
        let role = event.target.getAttribute("attr")
        let index = event.target.getAttribute("index")

        let newListForBattle = this.state[role].listForBattle.filter((value) => value.key !== index);
        let newListToDisplay = this.state[role].listToDisplay.filter((value) => value.key !== index);

        this.setState({
            advisorList: undefined,
            advDisabled: true,
            [role]: {
                ...this.state[role],
                listForBattle: newListForBattle,
                listToDisplay: newListToDisplay,
            }
        });


    }



    submitForm = async event => {
        event.preventDefault();
        let advDisabled = this.state.leftPanel.listForBattle.length > 15 || this.state.leftPanel.listForBattle.length < 3 || this.state.rightPanel.listForBattle.length > 50 || this.state.rightPanel.listForBattle.length < 1
        let triple = this.state.triple
        let pvpoke = this.props.parentState.pvpoke
        for (let i = 0; i < this.state.leftPanel.listForBattle.length; i++) {
            this.state.leftPanel.listForBattle[i].Query = decodeURIComponent(encodeQueryData(this.state.leftPanel.listForBattle[i]))
        }
        for (let i = 0; i < this.state.rightPanel.listForBattle.length; i++) {
            this.state.rightPanel.listForBattle[i].Query = decodeURIComponent(encodeQueryData(this.state.rightPanel.listForBattle[i]))
        }
        this.setState({
            advDisabled: true,
            loading: true,
        })
        let reason = ""
        const response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/matrix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Encoding": "gzip",
                "Pvp-Type": pvpoke ? "pvpoke" : "normal",
                "Pvp-Shields": triple ? "triple" : "normal",
            },
            body: JSON.stringify({ Party1: this.state.leftPanel.listForBattle, Party2: this.state.rightPanel.listForBattle, })
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({
                advDisabled: true,
                showResult: false,
                isError: true,
                loading: false,
                error: String(reason)
            });
            return
        }
        let data = await response.json();

        if (!response.ok) {
            if (data.detail === "PvP error") {
                this.setState({
                    advDisabled: true,
                    showResult: false,
                    isError: true,
                    loading: false,
                    error: data.case.What
                });
                return;
            }
            this.setState({
                advDisabled: true,
                showResult: false,
                isError: true,
                loading: false,
                error: data.detail
            });
            return;
        }
        switch (triple) {
            case true:
                var arr = this.pvpTriple(data, pvpoke ? "/pvpoke" : "")
                break
            default:
                arr = this.pvpSingle(data[0], pvpoke ? "/pvpoke" : "")
        }
        let tableBody = this.makeTable(arr)

        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            result: tableBody,
            rawResult: arr,
            pvpData: data,

            advisorList: undefined,
            advDisabled: advDisabled,
        });
    };



    readParties() {
        let partiesList = [
            <option value="" key=""></option>,
            <option value="Preset1" key="Preset1">{strings.options.matrixpreset.great}</option>,
            <option value="Preset2" key="Preset2">{strings.options.matrixpreset.ultra}</option>,
            <option value="Preset3" key="Preset3">{strings.options.matrixpreset.master}</option>,
        ]
        for (let i = 0; i < localStorage.length; i++) {
            partiesList.push(<option value={localStorage.key(i)} key={localStorage.key(i)}>{localStorage.key(i)}</option>)
        }
        return partiesList
    }

    makeTable(arr) {
        return [
            <thead key={"thead0"} className="thead thead-light" >
                <tr >
                    {arr[0]}
                </tr>
            </thead>,
            <tbody key={"tablebody"} className="modifiedBorderTable">
                {arr.slice(1).map((elem, i) => {
                    return <tr key={"tableline" + i}>
                        {elem}
                    </tr>
                })}
            </tbody>
        ]
    }



    pvpSingle(data, pvpoke) {
        //markup table
        let arr = this.makeTableLines()

        //fill cells
        data.forEach((elem) => {
            let line = elem.I + 1
            let row = elem.K + 1
            arr[line].push(<td key={line + row} className="modifiedBorderTable matrixColor defaultFont m-0 p-0 align-middle" >
                <a className={"rateMatrix hover rateColor " + returnRateStyle(elem.Rate)[1]}
                    href={window.location.origin + "/pvp/single/" + this.props.parentState.league + "/" +
                        encodeURIComponent(elem.QueryA) + "/" + encodeURIComponent(elem.QueryB) + pvpoke}>
                    {elem.Rate}
                </a>
            </td >)
        })
        return arr
    }

    makeTableLines() {
        return [[<th key={"zero"} className="modifiedBorderTable theadT p-0 px-1" scope="col" />,
        ...this.state.rightPanel.listForBattle.map((pok, j) => {
            return <TheadElement key={j + pok.name + "thead"} pok={pok} j={j}
                pokemonTable={this.props.parentState.pokemonTable} addStar={this.addStar} />
        }),],
        ...this.state.leftPanel.listForBattle.map((pok, i) => {
            return [<LineElement key={i + pok.name + "line"} pok={pok} i={i}
                pokemonTable={this.props.parentState.pokemonTable} addStar={this.addStar} />]
        }),]
    }

    addStar(pokName, moveName) {
        return (this.props.parentState.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    pvpTriple(data, pvpoke) {
        //markup table
        let arr = this.makeTableLines()

        //fill cells
        data[0].forEach((elem, i) => {
            let line = elem.I + 1
            let row = elem.K + 1
            let rating = Math.round((elem.Rate + data[1][i].Rate + data[2][i].Rate) / 3)
            let rate00 = returnRateStyle(elem.Rate)
            let rate11 = returnRateStyle(data[1][i].Rate)
            let rate22 = returnRateStyle(data[2][i].Rate)
            let rateOverall = returnRateStyle(rating)
            data[0][i].Rate = rating

            arr[line].push(<td key={line + row} className="matrixCellWidth modifiedBorderTable defaultFont p-0 m-0 px-1 align-middle" >
                <div className="matrixCard bor row justify-content-center m-0 p-0 mr-auto ml-auto">
                    <a className={"col-4 m-0 p-0 text-center cupl hover matrixCardThead rateColor " + rate00[1]}
                        href={window.location.origin + "/pvp/single/" + this.props.parentState.league + "/" +
                            encodeURIComponent(elem.QueryA) + "/" + encodeURIComponent(elem.QueryB) + pvpoke}>
                        {rate00[0]}
                    </a>
                    <a className={"col-4 m-0 p-0 text-center  hover matrixCardThead borx rateColor " + rate11[1]}
                        href={window.location.origin + "/pvp/single/" + this.props.parentState.league + "/" +
                            encodeURIComponent(data[1][i].QueryA) + "/" + encodeURIComponent(data[1][i].QueryB) + pvpoke}>
                        {rate11[0]}
                    </a>
                    <a className={"col-4 m-0 p-0 text-center cupr hover matrixCardThead rateColor " + rate22[1]}
                        href={window.location.origin + "/pvp/single/" + this.props.parentState.league + "/" +
                            encodeURIComponent(data[2][i].QueryA) + "/" + encodeURIComponent(data[2][i].QueryB) + pvpoke}>
                        {rate22[0]}
                    </a>

                    <div className={"matrixCardBody bort cbotlr col-12 m-0 p-0 rateColor " + rateOverall[1]}>
                        {rating}
                    </div>

                </div>
            </td >)
        });
        return arr
    }

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
        );
    }



    onPokemonAdd(event) {
        event.event.preventDefault();
        if (this.state[event.attr].listToDisplay.length >= 50) {
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

        let newListToDisplay = [...this.state[event.attr].listToDisplay]
        newListToDisplay.push(
            <ListEntry
                onPokemonDelete={this.onPokemonDelete}
                attr={event.attr}
                onClick={this.onPokRedact}

                key={key}
                index={key}
                thead={<><PokemonIconer
                    src={this.props.parentState.pokemonTable[event.pokemon.name].Number +
                        (this.props.parentState.pokemonTable[event.pokemon.name].Forme !== "" ? "-" + this.props.parentState.pokemonTable[event.pokemon.name].Forme : "")}
                    class={"icon24 mr-1"}
                    for={""}
                />
                    {event.pokemon.name}
                </>}
                body={event.pokemon.QuickMove + this.addStar(event.pokemon.name, event.pokemon.QuickMove) +
                    (event.pokemon.ChargeMove1 ?
                        " + " + event.pokemon.ChargeMove1 + this.addStar(event.pokemon.name, event.pokemon.ChargeMove1) : "") +
                    (event.pokemon.ChargeMove2 ?
                        "/" + event.pokemon.ChargeMove2 + this.addStar(event.pokemon.name, event.pokemon.ChargeMove2) : "")
                }
            />
        );

        this.setState({
            advisorList: undefined,
            advDisabled: true,
            [event.attr]: {
                ...this.state[event.attr],
                listForBattle: newListForBattle,
                listToDisplay: newListToDisplay,
            }
        });
    }

    onPartySave(event) {
        if (localStorage.getItem(event.value) === null) {
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

            localStorage.setItem(event.value, JSON.stringify(this.state[event.attr].listForBattle));
            return
        }

        this.setState({
            [event.attr]: {
                ...this.state[event.attr],
                showPokSelect: false,
                showSavePanel: false,
            }
        })
        localStorage.setItem(event.value, JSON.stringify(this.state[event.attr].listForBattle));
    }

    onPokRedact(event) {
        if (event.target.getAttribute("name") === "closeButton") {
            return
        }
        let listForBattle = this.state[event.currentTarget.getAttribute("attr")].listForBattle
        let index = event.currentTarget.getAttribute("index")
        let elementNumber
        let pokemon

        for (let i = 0; i < listForBattle.length; i++) {
            if (listForBattle[i].key === index) {
                elementNumber = i
                pokemon = listForBattle[i]
                break
            }
        }

        this.setState({
            redact: {
                ...this.state.redact,
                showMenu: true,
                attr: event.currentTarget.getAttribute("attr"),
                number: elementNumber,
                pokemon: pokemon,
            }
        })

    }

    onPokRedactOff(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
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


        let newListToDisplay = [...this.state[this.state.redact.attr].listToDisplay]
        newListToDisplay[this.state.redact.number] = <ListEntry
            onPokemonDelete={this.onPokemonDelete}
            attr={this.state.redact.attr}
            onClick={this.onPokRedact}

            className={""}
            key={pokCopy.key}
            index={pokCopy.key}
            thead={<><PokemonIconer
                src={this.props.parentState.pokemonTable[pokCopy.name].Number +
                    (this.props.parentState.pokemonTable[pokCopy.name].Forme !== "" ? "-" + this.props.parentState.pokemonTable[pokCopy.name].Forme : "")}
                class={"icon24 mr-1"}
                for={""}
            />
                {pokCopy.name}
            </>}

            body={pokCopy.QuickMove + this.addStar(pokCopy.name, pokCopy.QuickMove) +
                (pokCopy.ChargeMove1 ? " + " + pokCopy.ChargeMove1 + this.addStar(pokCopy.name, pokCopy.ChargeMove1) : "") +
                (pokCopy.ChargeMove2 ? "/" + pokCopy.ChargeMove2 + this.addStar(pokCopy.name, pokCopy.ChargeMove2) : "")
            }
        />

        let newListForBattle = [...this.state[this.state.redact.attr].listForBattle]
        newListForBattle[this.state.redact.number] = pokCopy

        this.setState({
            advisorList: undefined,
            advDisabled: true,
            [this.state.redact.attr]: {
                ...this.state[this.state.redact.attr],
                listForBattle: newListForBattle,
                listToDisplay: newListToDisplay,
            },
            redact: {
                showMenu: false,
            },
        })

    }


    onAdvisorSubmit() {
        let rateList = this.state.leftPanel.listForBattle.map((elem, i) => {
            let j = this.state.rightPanel.listForBattle.length * i
            let maxj = j + this.state.rightPanel.listForBattle.length
            let singleRate = 0
            let zeros = {}

            for (; j < maxj; j++) {
                singleRate += this.state.pvpData[0][j].Rate
                if (this.state.pvpData[0][j].Rate <= 500) {
                    zeros[this.state.pvpData[0][j].K] = true
                }
            }
            return { rate: singleRate / this.state.rightPanel.listForBattle.length, zeros: zeros }
        });

        let parties = []

        this.state.leftPanel.listForBattle.forEach((pokA) => {

        });

        for (let i = 0; i < this.state.leftPanel.listForBattle.length; i++) {
            for (let j = i + 1; j < this.state.leftPanel.listForBattle.length; j++) {
                for (let k = j + 1; k < this.state.leftPanel.listForBattle.length; k++) {
                    parties.push({
                        first: i, second: j, third: k,
                        rate: rateList[i].rate + rateList[j].rate + rateList[k].rate,
                        zeros: this.countWeakSpots(rateList[i].zeros, rateList[j].zeros, rateList[k].zeros)
                    })
                }
            }
        }
        parties.sort((a, b) => {
            if (a.zeros.length === b.zeros.length) { return b.rate - a.rate }
            return a.zeros.length - b.zeros.length
        });
        this.setState({
            advisorList: parties,
        })
    }

    countWeakSpots(objA, objB, objC) {
        let counter = []
        for (const [key, value] of Object.entries(objA)) {
            if (value && objB[key] && objC[key]) {
                counter.push(key)
            }
        }
        return counter
    }

    render() {

        return (
            < >
                <div className="row justify-content-between mb-4"  >
                    {this.state.redact.showMenu && <RedactPokemon
                        pokemonTable={this.props.parentState.pokemonTable}
                        moveTable={this.props.parentState.moveTable}

                        pokList={this.props.parentState.pokList}
                        quickMoveList={this.props.parentState.quickMoveList}
                        chargeMoveList={this.props.parentState.chargeMoveList}

                        league={this.props.parentState.league}

                        value={this.state[this.state.redact.attr]}

                        redact={this.state.redact}

                        onClick={this.onPokRedactOff}
                        onPokemonAdd={this.onRedactSubmit}
                    />}
                    <div className="results order-1 ml-1 mx-lg-0 mt-1  mt-md-2" >
                        <MatrixPanel
                            pokemonTable={this.props.parentState.pokemonTable}
                            moveTable={this.props.parentState.moveTable}

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
                            onPokemonDelete={this.onPokemonDelete}

                            onPartySave={this.onPartySave}
                        />
                    </div>



                    <div className="overflowing order-3 order-lg-1 col-12 col-lg mt-0 mt-lg-2 mx-0 px-0" >
                        <div className="row mx-1 h-100"  >
                            {(this.state.showResult || this.state.isError) && <div className="align-self-start matrixResult order-3 order-lg-1  col-12 mt-3 mt-lg-0 p-2 ">
                                <div className="row  justify-content-center mx-0"  >
                                    <div className="overflowingxy height400resp order-2 p-0 mx-2 order-lg-1 col-12 ">
                                        {this.state.showResult &&
                                            <Result
                                                class="tableFixHead"
                                                table={this.state.result}
                                            />}
                                        {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                                    </div>
                                </div>
                            </div>}
                            {this.state.loading &&
                                <div className="col-12 mt-2 order-lg-2" >
                                    <Loader
                                        color="white"
                                        weight="500"
                                        locale={strings.tips.loading}
                                        loading={this.state.loading}
                                    />
                                </div>}
                            <div className="align-self-end order-1 order-lg-3 col px-0">
                                <div className="order-2 order-lg-3 d-flex justify-content-center bd-highligh mx-0 px-0 col-12  mt-2 mt-lg-0" >
                                    <SubmitButton
                                        action="Let's Battle"
                                        label={strings.buttons.letsbattle}
                                        onSubmit={this.submitForm}
                                        class="btn btn-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="results order-2 order-lg-3 mr-1 mx-lg-0 mt-1 mt-md-0 mt-md-2" >
                        <MatrixPanel
                            pokemonTable={this.props.parentState.pokemonTable}
                            moveTable={this.props.parentState.moveTable}

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
                            onPokemonDelete={this.onPokemonDelete}
                            onPartySave={this.onPartySave}
                        />
                    </div>

                    {this.state.advisorList && <div className="order-6 col-12 p-1 pt-3" >
                        <div className="row mx-1  justify-content-center"  >
                            <Advisor
                                list={this.state.advisorList}

                                rawResult={this.state.rawResult}
                                pokemonTable={this.props.parentState.pokemonTable}
                                moveTable={this.props.parentState.moveTable}

                                leftPanel={this.state.leftPanel}
                                rightPanel={this.state.rightPanel}
                            />
                        </div>
                    </div>}
                </div>
            </ >
        );
    }
}



export default MatrixPvp




