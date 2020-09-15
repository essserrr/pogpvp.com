import React from "react";
import Pokemon from "./Pokemon";
import MagicBox from "./MagicBox/MagicBox"
import SubmitButton from "./SubmitButton/SubmitButton"
import {
    returnMovePool, calculateMaximizedStats, processInitialStats, checkLvl, checkIV,
    calculateEffStat, selectCharge, selectQuick
} from "../../../js/indexFunctions.js"
import { getCookie } from "../../../js/getCookie"

import LocalizedStrings from "react-localization";
import { locale } from "../../../locale/locale"

let strings = new LocalizedStrings(locale);


class RedactPokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        //get movepool
        let moves = returnMovePool(props.redact.pokemon.name, props.pokemonTable, strings.options.moveSelect, false,
            [props.redact.pokemon.QuickMove], [props.redact.pokemon.ChargeMove1, props.redact.pokemon.ChargeMove2])
        //create default iv set
        let ivSet = calculateMaximizedStats(props.redact.pokemon.name, props.value.maximizer.level, props.pokemonTable)
        let whatToMaximize = (props.value.maximizer.action === "Default") ? "Default" : props.value.maximizer.stat

        this.state = {
            shieldsList: [
                <option value="0" key="0">0</option>,
                <option value="1" key="1">1</option>,
                <option value="2" key="2">2</option>
            ],
            stagesList: [
                <option value="4" key="4">4</option>,
                <option value="3" key="3">3</option>,
                <option value="2" key="2">2</option>,
                <option value="1" key="1">1</option>,
                <option value="0" key="0">0</option>,
                <option value="-1" key="-1">-1</option>,
                <option value="-2" key="-2">-2</option>,
                <option value="-3" key="-3">-3</option>,
                <option value="-4" key="-4">-4</option>,
            ],
            stratigiesList: [
                <option value="true" key="Greedy">{strings.options.strategy.greedy}</option>,
                <option value="false" key="Shieldsaving">{strings.options.strategy.shieldSaving}</option>,
            ],
            strategyTip: [
                <>
                    {strings.tips.strategy.greedy}
                    <br />
                    <br />
                    {strings.tips.strategy.shieldSaving}
                </>
            ],
            pokemon: {
                ...props.redact.pokemon,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,

                effAtk: calculateEffStat(props.redact.pokemon.name, ivSet[props.league][whatToMaximize].Level,
                    ivSet[props.league][whatToMaximize].Atk, props.redact.pokemon.AtkStage,
                    props.pokemonTable, "Atk", props.redact.pokemon.IsShadow),

                effDef: calculateEffStat(props.redact.pokemon.name, ivSet[props.league][whatToMaximize].Level,
                    ivSet[props.league][whatToMaximize].Def, props.redact.pokemon.DefStage,
                    props.pokemonTable, "Def", props.redact.pokemon.IsShadow),

                effSta: calculateEffStat(props.redact.pokemon.name, ivSet[props.league][whatToMaximize].Level,
                    ivSet[props.league][whatToMaximize].Sta, 0, props.pokemonTable, "Sta"),

                maximizer: props.value.maximizer,

                HP: undefined,
                Energy: undefined,
            },
        };

        this.onChange = this.onChange.bind(this);
        this.statMaximizer = this.statMaximizer.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPokemonSubmit = this.onPokemonSubmit.bind(this);
    }

    onClick(event) {
        let role = event.target.getAttribute("attr")
        this.setState({
            [role]: {
                ...this.state[role],
                showMenu: false,
                isSelected: undefined,
            }
        });
    }

    onNameChange(event, name) {
        //get movepool
        let moves = returnMovePool(event.value, this.props.pokemonTable, strings.options.moveSelect)
        let quick = selectQuick(moves.quickMovePool, this.props.moveTable, event.value, this.props.pokemonTable)
        let charge = selectCharge(moves.chargeMovePool, this.props.moveTable, event.value, this.props.pokemonTable)
        //create default iv set
        let ivSet = calculateMaximizedStats(event.value, this.state.pokemon.maximizer.level, this.props.pokemonTable)
        let whatToMaximize = (this.state.pokemon.maximizer.action === "Default") ? "Default" : this.state.pokemon.maximizer.stat

        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                name: event.value,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,
                QuickMove: quick,
                ChargeMove1: charge.primaryName,
                ChargeMove2: charge.secodaryName,
                Lvl: ivSet[this.props.league][whatToMaximize].Level,
                Atk: ivSet[this.props.league][whatToMaximize].Atk,
                Def: ivSet[this.props.league][whatToMaximize].Def,
                Sta: ivSet[this.props.league][whatToMaximize].Sta,

                effAtk: calculateEffStat(event.value, ivSet[this.props.league][whatToMaximize].Level,
                    ivSet[this.props.league][whatToMaximize].Atk, this.state[name].AtkStage,
                    this.props.pokemonTable, "Atk", this.state[name].IsShadow),

                effDef: calculateEffStat(event.value, ivSet[this.props.league][whatToMaximize].Level,
                    ivSet[this.props.league][whatToMaximize].Def, this.state[name].DefStage,
                    this.props.pokemonTable, "Def", this.state[name].IsShadow),

                effSta: calculateEffStat(event.value, ivSet[this.props.league][whatToMaximize].Level,
                    ivSet[this.props.league][whatToMaximize].Sta, 0, this.props.pokemonTable, "Sta"),

                HP: undefined,
                Energy: undefined,
            }
        });
    }

    onInitialStatsChange(event, role) {
        let correspondingStat = event.target.name.replace("Initial", "")
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: processInitialStats(event.target.value),
                [correspondingStat]: (processInitialStats(event.target.value) !== "0") ?
                    processInitialStats(event.target.value) : undefined,
            }
        });
    }

    onIvChange(event, role) {
        let eff = calculateEffStat(this.state[role].name, this.state[role].Lvl, event.target.value,
            this.state[role][event.target.name + "Stage"],
            this.props.pokemonTable, event.target.name, this.state[role].IsShadow)
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkIV(event.target.value) + "",
                ["eff" + event.target.name]: eff
            }
        });
    }

    onLevelChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkLvl(event.target.value) + "",
                effAtk: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Atk,
                    this.state[role].AtkStage, this.props.pokemonTable, "Atk", this.state[role].IsShadow),
                effDef: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Def,
                    this.state[role].DefStage, this.props.pokemonTable, "Def", this.state[role].IsShadow),
                effSta: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Sta,
                    0, this.props.pokemonTable, "Sta"),
            }
        });
    }

    onTypeChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                effAtk: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Atk,
                    this.state[role].AtkStage, this.props.pokemonTable, "Atk", event.target.value),
                effDef: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Def,
                    this.state[role].DefStage, this.props.pokemonTable, "Def", event.target.value),
                effSta: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Sta,
                    0, this.props.pokemonTable, "Sta"),
            }
        });
    }

    onStageChange(event, role) {
        let correspondingStat = event.target.name.replace("Stage", "")
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                ["eff" + correspondingStat]: calculateEffStat(this.state[role].name, this.state[role].Lvl,
                    this.state[role][correspondingStat], event.target.value, this.props.pokemonTable, correspondingStat, this.state[role].IsShadow),
            }
        });
    }

    onMoveAdd(value, attr, category) {
        switch (category.includes("Charge")) {
            case true:
                let newMovePool = [...this.state[attr].chargeMovePool]
                newMovePool.splice((newMovePool.length - 2), 0, <option value={value} key={value}>{value + "*"}</option>);
                this.setState({
                    [attr]: {
                        ...this.state[attr],
                        showMenu: false,
                        isSelected: undefined,
                        chargeMovePool: newMovePool,
                        [category]: value,
                    }
                });
                break
            default:
                newMovePool = [...this.state[attr].quickMovePool]
                newMovePool.splice((newMovePool.length - 2), 0, <option value={value} key={value}>{value + "*"}</option>);
                this.setState({
                    [attr]: {
                        ...this.state[attr],
                        showMenu: false,
                        isSelected: undefined,
                        quickMovePool: newMovePool,
                        [category]: value,
                    }
                });
                break
        }
    }

    onUserPokemonSelect(index, role) {
        let selectedPok = this.props.userPokemon[index]

        //get movepool
        let moves = returnMovePool(selectedPok.Name, this.props.pokemonTable, strings.options.moveSelect)
        //set state
        this.setState({
            [role]: {
                ...this.state[role],
                name: selectedPok.Name,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,
                QuickMove: selectedPok.QuickMove,
                ChargeMove1: selectedPok.ChargeMove,
                ChargeMove2: selectedPok.ChargeMove2,

                Lvl: selectedPok.Lvl,
                Atk: selectedPok.Atk,
                Def: selectedPok.Def,
                Sta: selectedPok.Sta,

                effAtk: calculateEffStat(selectedPok.Name, selectedPok.Lvl, selectedPok.Atk, this.state[role].AtkStage,
                    this.props.pokemonTable, "Atk", selectedPok.IsShadow),
                effDef: calculateEffStat(selectedPok.Name, selectedPok.Lvl, selectedPok.Def,
                    this.state[role].DefStage, this.props.pokemonTable, "Def", selectedPok.IsShadow),
                effSta: calculateEffStat(selectedPok.Name, selectedPok.Lvl, selectedPok.Sta, 0, this.props.pokemonTable, "Sta"),

                IsShadow: selectedPok.IsShadow,

                HP: undefined,
                Energy: undefined,
            },
            stateModified: true,
        });
    }

    onChange(event, name) {
        //check if it`s a name change
        if (event.target === undefined) {
            switch (name.name[1]) {
                case "QuickMove":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    return
                case "ChargeMove1":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    return
                case "ChargeMove2":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    return
                case "userPokemon":
                    this.onUserPokemonSelect(event.index, name.name[0])
                    return
                default:
                    this.onNameChange(event, name.name[0])
                    return
            }
        }
        let role = event.target.getAttribute("attr")
        let action = event.target.getAttribute("action")
        //check if it's an initial stat change
        if (action === "defaultStatMaximizer") {
            this.statMaximizer(event, role)
            return
        }
        if (event.target.name === "InitialHP" || event.target.name === "InitialEnergy") {
            this.onInitialStatsChange(event, role)
            return
        }
        //check if it's an iv change
        if (event.target.name === "Sta" || event.target.name === "Def" || event.target.name === "Atk") {
            this.onIvChange(event, role)
            return
        }
        //check if it's an level change
        if (event.target.name === "Lvl") {
            this.onLevelChange(event, role)
            return
        }
        //if it's an stage change
        if (event.target.name === "AtkStage" || event.target.name === "DefStage") {
            this.onStageChange(event, role)
            return
        }
        if (event.target.value === "Select...") {
            this.setState({
                [role]: {
                    ...this.state[role],
                    showMenu: true,
                    isSelected: event.target.name,
                }
            });
            return
        }
        //if it's an type change
        if (event.target.name === "IsShadow") {
            this.onTypeChange(event, role)
            return
        }
        //otherwise follow general pattern
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value
            }
        });
    }



    statMaximizer(event, role) {
        let max = {
            ...this.state[role].maximizer,
            [event.target.name]: event.target.value,
        }

        let ivSet = calculateMaximizedStats(this.state[role].name, max.level, this.props.pokemonTable)
        let whatToMaximize = (max.action === "Default") ? "Default" : max.stat

        this.setState({
            [role]: {
                ...this.state[role],
                HP: undefined, Energy: undefined,

                Lvl: ivSet[this.props.league][whatToMaximize].Level,
                Atk: ivSet[this.props.league][whatToMaximize].Atk,
                Def: ivSet[this.props.league][whatToMaximize].Def,
                Sta: ivSet[this.props.league][whatToMaximize].Sta,

                effAtk: calculateEffStat(this.state[role].name, ivSet[this.props.league][whatToMaximize].Level,
                    ivSet[this.props.league][whatToMaximize].Atk, this.state[role].AtkStage,
                    this.props.pokemonTable, "Atk", this.state[role].IsShadow),

                effDef: calculateEffStat(this.state[role].name, ivSet[this.props.league][whatToMaximize].Level,
                    ivSet[this.props.league][whatToMaximize].Def, this.state[role].DefStage,
                    this.props.pokemonTable, "Def", this.state[role].IsShadow),

                effSta: calculateEffStat(this.state[role].name, ivSet[this.props.league][whatToMaximize].Level,
                    ivSet[this.props.league][whatToMaximize].Sta, 0,
                    this.props.pokemonTable, "Sta"),

                maximizer: max,
            },
        });
    }

    onPokemonSubmit(event) {
        event.preventDefault();
        if (this.state.pokemon.name === strings.tips.nameSearch) {
            return
        }
        this.props.onPokemonAdd({
            pokemon: this.state.pokemon,
        })
    }

    render() {
        return (
            <MagicBox
                onClick={this.props.onClick}
                attr={this.props.redact.attr}
                element={
                    <div className="row justify-content-center">
                        <Pokemon
                            className="large m-1 mb-3 col-12"

                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.moveTable}
                            value={this.state.pokemon}
                            attr="pokemon"
                            onChange={this.onChange}
                            pokList={this.props.pokList}
                            userPokemon={this.props.userPokemon}

                            showMenu={this.state.pokemon.showMenu}

                            moveList={(this.state.pokemon.isSelected && this.state.pokemon.isSelected.includes("Charge")) ? this.props.chargeMoveList : this.props.quickMoveList}
                            category={this.state.pokemon.isSelected}
                            onClick={this.onClick}
                        />
                        <SubmitButton
                            class="matrixButton btn btn-primary btn-sm p-0 m-0  mx-1"
                            attr={this.props.redact.attr}
                            action={"Add pokemon"}
                            label={strings.buttons.submitchange}
                            onSubmit={this.onPokemonSubmit}
                        />
                    </div>
                }
            />
        )
    }

}

export default RedactPokemon