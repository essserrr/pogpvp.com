import React from "react";
import SubmitButton from "./components/SubmitButton/SubmitButton"
import MatrixPanel from "./components/MatrixPanel"
import Errors from "./components/Errors/Errors"
import ListEntry from "./components/MatrixPokemonList/ListEntry"
import { encodeQueryData, getCookie, calculateMaximizedStats } from "../../js/indexFunctions.js"
import { great, ultra, master } from "./matrixPresets"
import Result from "./components/Result"
import RedactPokemon from "./components/RedactPokemon"


import LocalizedStrings from 'react-localization';
import { locale } from "../../locale/locale"
import BarLoader from "react-spinners/BarLoader";

let strings = new LocalizedStrings(locale);

function readParties() {
    var partiesList = [
        <option value="" key=""></option>,
        <option value="Preset1" key="Preset1">{strings.options.matrixpreset.great}</option>,
        <option value="Preset2" key="Preset2">{strings.options.matrixpreset.ultra}</option>,
        <option value="Preset3" key="Preset3">{strings.options.matrixpreset.master}</option>,
    ]
    for (var i = 0; i < localStorage.length; i++) {
        partiesList.push(<option value={localStorage.key(i)} key={localStorage.key(i)}>{localStorage.key(i)}</option>)
    }
    return partiesList
}

function makeTableBody(arr) {
    var tableBody = []
    //create table body
    tableBody.push(
        <thead key={"thead0"} className="thead thead-light" >
            <tr >
                {arr[0]}
            </tr>
        </thead>
    )
    var arrWithTr = []
    for (let i = 1; i < arr.length; i++) {
        arrWithTr.push(
            <tr key={"tableline" + i}>
                {arr[i]}
            </tr>
        )
    }
    tableBody.push(
        <tbody key={"tablebody"} className="modifiedBorderTable">
            {arrWithTr}
        </tbody>
    )
    return tableBody
}

function makeTableLines(rightList, leftList, data, league, pvppoke) {
    var arr = []
    //add thead
    arr.push([])
    arr[0].push(<th key={"zero"} className="modifiedBorderTable theadT" scope="col" ></th>)
    for (let j = 0; j < rightList.length; j++) {
        arr[0].push(<th key={j + "thead"} className="modifiedBorderTable theadT" scope="col" >
            {rightList[j].name}
        </th>
        )
    }

    //add table lines
    for (let i = 0; i < leftList.length; i++) {
        arr.push([])
        arr[i + 1].push(<td key={i + "line"} className="modifiedBorderTable defaultFont fixFirstRow m-0 px-1 py-0" >
            {leftList[i].name}
        </td>)
        for (let j = 0; j < rightList.length; j++) {
            arr[i + 1].push([])
        }
    }
    //fill cells
    for (let i = 0; i < data.length; i++) {
        var line = data[i].I + 1
        var row = data[i].K + 1
        arr[line][row] = <td key={line + row} className="modifiedBorderTable defaultFont m-0 p-0" >
            <a href={window.location.origin + "/pvp/single/" + league + "/" + encodeQueryData(leftList[data[i].I]) + "/" + encodeQueryData(rightList[data[i].K]) + (pvppoke ? "/pvpoke" : "")}>
                <div className={"rate " + ((data[i].Attacker.Rate > 500) ? "win" : "lose")}>{data[i].Attacker.Rate}</div>
            </a>
        </td >
    }
    return arr
}


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
            savedParties: readParties(),

            redact: {
                showMenu: false,
            },


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
        this.onPartyChange = this.onPartyChange.bind(this);
        this.onPokRedact = this.onPokRedact.bind(this);
        this.onPokRedactOff = this.onPokRedactOff.bind(this);
        this.onRedactSubmit = this.onRedactSubmit.bind(this);

    }


    statMaximizer(event) {
        event.persist()
        var role = event.target.getAttribute('attr')

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
                "Lvl": ivSet[this.props.parentState.league][whatToMaximize]["Level"],
                "Atk": ivSet[this.props.parentState.league][whatToMaximize]["Atk"],
                "Def": ivSet[this.props.parentState.league][whatToMaximize]["Def"],
                "Sta": ivSet[this.props.parentState.league][whatToMaximize]["Sta"],
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




    onPopup(event) {
        event.preventDefault();

        var stat = event.target.getAttribute('stat')
        var role = event.target.getAttribute('attr')

        this.setState({
            [role]: {
                ...this.state[role],
                [stat]: true,
            }
        });
    }

    onPartyDelete(event) {
        event.preventDefault();
        var attr = event.target.getAttribute('attr')
        var key = this.state[attr].selectedParty
        if (key === "") {
            return
        }
        var newParties = this.state.savedParties.filter(
            function (value) {
                return value.key !== key;
            }
        );
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

    onPartySelect(event) {
        let attr = event.target.getAttribute('attr')

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

        let currentListToDisplay = []
        for (var i = 0; i < newListForBattle.length; i++) {
            var key = newListForBattle[i].name + i
            newListForBattle[i].key = key
            currentListToDisplay.push(<ListEntry
                onPokemonDelete={this.onPokemonDelete}
                attr={attr}
                onClick={this.onPokRedact}

                className={"color" + this.props.parentState.pokemonTable[newListForBattle[i].name].Type[0] + " text"}
                key={key}
                index={key}
                thead={newListForBattle[i].name}
                body={newListForBattle[i].QuickMove +
                    (newListForBattle[i].ChargeMove1 ? ", " + newListForBattle[i].ChargeMove1 : "") +
                    (newListForBattle[i].ChargeMove2 ? ", " + newListForBattle[i].ChargeMove2 : "")
                }
            />)
        }
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: event.target.value,
                listToDisplay: currentListToDisplay,
                listForBattle: newListForBattle,
            }
        });

    }

    onChange(event) {
        //otherwise follow general pattern
        var action = event.target.getAttribute('action')
        if (action === "defaultStatMaximizer") {
            this.statMaximizer(event)
            return
        }
        if (action === "Add pokemon" || action === "Save") {
            this.onPopup(event)
            return
        }
        if (action === "Delete") {
            this.onPartyDelete(event)
            return
        }
        if (event.target.name === "selectedParty") {
            this.onPartySelect(event)
            return
        }
        let role = event.target.getAttribute('attr')
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
        var role = event.target.getAttribute('attr')
        this.setState({
            [role]: {
                ...this.state[role],
                showPokSelect: false,
                showSavePanel: false,
            }
        });
    }

    onPokemonDelete(event) {
        var role = event.target.getAttribute('attr')
        var index = event.target.getAttribute('index')

        var newListForBattle = this.state[role].listForBattle.filter(
            function (value) {
                return value.key !== index;
            }
        );
        var newListToDisplay = this.state[role].listToDisplay.filter(
            function (value) {
                return value.key !== index;
            }
        );

        this.setState({
            [role]: {
                ...this.state[role],
                listForBattle: newListForBattle,
                listToDisplay: newListToDisplay,
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
        this.setState({
            loading: true,
        })
        var reason = ""
        const response = await fetch(((navigator.userAgent != "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/matrix", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip',
                'Pvp-Type': this.props.parentState.pvppoke ? "pvppoke" : "normal",
            },
            body: JSON.stringify({ Party1: this.state.leftPanel.listForBattle, Party2: this.state.rightPanel.listForBattle, })
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(reason)
            });
            return
        }
        var data = await response.json();

        if (!response.ok) {
            if (data.detail === "PvP error") {
                this.setState({
                    showResult: false,
                    isError: true,
                    loading: false,
                    error: data.case.What
                });
                return;
            }
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: data.detail
            });
            return;
        }

        var arr = makeTableLines(this.state.rightPanel.listForBattle, this.state.leftPanel.listForBattle, data, this.props.parentState.league, this.props.parentState.pvppoke)
        var tableBody = makeTableBody(arr)


        this.setState({
            showResult: true,
            isError: false,
            loading: false,
            result: tableBody,
        });
    };



    onPokemonAdd(event) {
        event.event.preventDefault();
        if (this.state[event.attr].listToDisplay.length >= 50) {
            return
        }

        var key = event.pokemon.name + Date.now()


        var pokCopy = {
            name: String(event.pokemon.name),
            Lvl: String(event.pokemon.Lvl),
            Atk: String(event.pokemon.Atk),
            Def: String(event.pokemon.Def),
            Sta: String(event.pokemon.Sta),
            Shields: String(event.pokemon.Shields),

            AtkStage: String(event.pokemon.AtkStage),
            DefStage: String(event.pokemon.DefStage),
            InitialHP: String(event.pokemon.InitialHP),
            InitialEnergy: String(event.pokemon.InitialEnergy),
            IsGreedy: String(event.pokemon.IsGreedy),
            IsShadow: String(event.pokemon.IsShadow),

            QuickMove: String(event.pokemon.QuickMove),
            ChargeMove1: String(event.pokemon.ChargeMove1),
            ChargeMove2: String(event.pokemon.ChargeMove2),
            key: key,
        }


        var newListForBattle = [...this.state[event.attr].listForBattle]
        newListForBattle.push(pokCopy);

        var newListToDisplay = [...this.state[event.attr].listToDisplay]
        newListToDisplay.push(
            <ListEntry
                onPokemonDelete={this.onPokemonDelete}
                attr={event.attr}
                onClick={this.onPokRedact}

                className={"color" + this.props.parentState.pokemonTable[event.pokemon.name].Type[0] + " text"}
                key={key}
                index={key}
                thead={event.pokemon.name}
                body={event.pokemon.QuickMove +
                    (event.pokemon.ChargeMove1 ? ", " + event.pokemon.ChargeMove1 : "") +
                    (event.pokemon.ChargeMove2 ? ", " + event.pokemon.ChargeMove2 : "")
                }
            />
        );

        this.setState({
            [event.attr]: {
                ...this.state[event.attr],
                listForBattle: newListForBattle,
                listToDisplay: newListToDisplay,
            }
        });
    }

    onPartyChange(event) {
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
        if (event.target.getAttribute('name') === "closeButton") {
            return
        }
        let listForBattle = this.state[event.currentTarget.getAttribute('attr')].listForBattle
        let index = event.currentTarget.getAttribute('index')
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
                attr: event.currentTarget.getAttribute('attr'),
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
        var pokCopy = {
            name: String(event.pokemon.name),
            Lvl: String(event.pokemon.Lvl),
            Atk: String(event.pokemon.Atk),
            Def: String(event.pokemon.Def),
            Sta: String(event.pokemon.Sta),
            Shields: String(event.pokemon.Shields),

            AtkStage: String(event.pokemon.AtkStage),
            DefStage: String(event.pokemon.DefStage),
            InitialHP: String(event.pokemon.InitialHP),
            InitialEnergy: String(event.pokemon.InitialEnergy),
            IsGreedy: String(event.pokemon.IsGreedy),
            IsShadow: String(event.pokemon.IsShadow),

            QuickMove: String(event.pokemon.QuickMove),
            ChargeMove1: String(event.pokemon.ChargeMove1),
            ChargeMove2: String(event.pokemon.ChargeMove2),
            key: event.pokemon.name + this.state.redact.number,
        }


        let newListToDisplay = [...this.state[this.state.redact.attr].listToDisplay]
        newListToDisplay[this.state.redact.number] = <ListEntry
            onPokemonDelete={this.onPokemonDelete}
            attr={this.state.redact.attr}
            onClick={this.onPokRedact}

            className={"color" + this.props.parentState.pokemonTable[pokCopy.name].Type[0] + " text"}
            key={pokCopy.key}
            index={pokCopy.key}
            thead={pokCopy.name}
            body={pokCopy.QuickMove +
                (pokCopy.ChargeMove1 ? ", " + pokCopy.ChargeMove1 : "") +
                (pokCopy.ChargeMove2 ? ", " + pokCopy.ChargeMove2 : "")
            }
        />

        let newListForBattle = [...this.state[this.state.redact.attr].listForBattle]
        newListForBattle[this.state.redact.number] = pokCopy

        this.setState({
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


                            value={this.state.leftPanel}

                            attr="leftPanel"
                            onChange={this.onChange}
                            onClick={this.onClick}
                            onPokemonAdd={this.onPokemonAdd}
                            onPokemonDelete={this.onPokemonDelete}

                            onPartyChange={this.onPartyChange}
                        />
                    </div>



                    <div className="overflowing order-3 order-lg-1 col-12 col-lg mt-0 mt-lg-2 mx-0 px-0" >
                        <div className="row mx-2 h-100"  >
                            {(this.state.showResult || this.state.isError) && <div className="align-self-start matrixResult col order-3 order-lg-1  col-12 mt-3 mt-lg-0 p-2 ">
                                <div className="row  justify-content-center mx-0"  >
                                    <div className="overflowingxy order-2 p-0 mx-2 order-lg-1 col-12 ">
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
                                <div className="col-12 mt-2 order-lg-2" style={{ fontWeight: "500", color: "white" }} >
                                    <div className="row justify-content-center">
                                        <div>
                                            {strings.tips.loading}
                                            <BarLoader
                                                color={"white"}
                                                loading={this.state.loading}
                                            />
                                        </div>
                                    </div>
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
                            onPartyChange={this.onPartyChange}
                        />
                    </div>
                </div>

            </ >

        );
    }
}



export default MatrixPvp