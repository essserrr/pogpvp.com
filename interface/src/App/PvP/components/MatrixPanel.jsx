import React from "react"
import ReactTooltip from "react-tooltip"
import LocalizedStrings from "react-localization"

import MenuItem from '@material-ui/core/MenuItem';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";
import Button from "App/Components/Button/Button";

import Switch from "App/Components/Switch/Switch";
import Pokemon from "./Pokemon"
import Maximizer from "./Maximizer/Maximizer"
import MagicBox from "./MagicBox/MagicBox"

import ImportExport from "./ImportExport/ImportExport"
import Stages from "./Stages/Stages"
import MatrixPokemonList from "./MatrixPokemonList/MatrixPokemonList"
import SaveMenu from "./SaveMenu/SaveMenu";
import Counter from "./Counter/Counter"

import { MovePoolBuilder } from "js/movePoolBuilder"
import {
    calculateMaximizedStats, processInitialStats, checkLvl, checkIV, calculateEffStat,
    pokemon, selectCharge, selectQuick
} from "../../../js/indexFunctions.js"
import { getCookie } from "../../../js/getCookie"
import { pvp } from "locale/Pvp/Pvp"
import { options } from "locale/Components/Options/locale"
import { advisor } from "locale/Pvp/Advisor/Advisor"

import "./MatrixPanel.scss"

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);
let advisorStrings = new LocalizedStrings(advisor);

class MatrixPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        advisorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            pokemon: {
                ...pokemon(),
                Shields: props.value.Shields,
                IsGreedy: props.value.IsGreedy,
                AtkStage: props.value.AtkStage,
                DefStage: props.value.DefStage,
                maximizer: props.value.maximizer,
            },
        };

        this.onChange = this.onChange.bind(this);
        this.statMaximizer = this.statMaximizer.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPokemonSubmit = this.onPokemonSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.value.Shields === prevProps.value.Shields && this.props.value.IsGreedy === prevProps.value.IsGreedy
            && this.props.value.AtkStage === prevProps.value.AtkStage && this.props.value.DefStage === prevProps.value.DefStage
            && this.props.value.maximizer === prevProps.value.maximizer) {
            return
        }


        let statCanUpd = this.props.pokemonTable && this.props.pokemonTable[this.state.pokemon.name]
        if (statCanUpd) {
            var ivSet = calculateMaximizedStats(this.state.pokemon.name, this.props.value.maximizer.level, this.props.pokemonTable)
            var whatToMaximize = (this.props.value.maximizer.action === "Default") ? "Default" : this.props.value.maximizer.stat
        }

        this.setState({
            pokemon: {
                ...this.state.pokemon,
                Lvl: statCanUpd ? ivSet[this.props.league][whatToMaximize].Level : "",
                Atk: statCanUpd ? ivSet[this.props.league][whatToMaximize].Atk : "",
                Def: statCanUpd ? ivSet[this.props.league][whatToMaximize].Def : "",
                Sta: statCanUpd ? ivSet[this.props.league][whatToMaximize].Sta : "",
                Shields: this.props.value.Shields,
                IsGreedy: this.props.value.IsGreedy,
                AtkStage: this.props.value.AtkStage,
                DefStage: this.props.value.DefStage,
                maximizer: this.props.value.maximizer,
            },
        })
    }


    onClick(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
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
        let moves = new MovePoolBuilder();
        moves.createMovePool(event.value, this.props.pokemonTable, optionStrings.options.moveSelect)
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
                    ivSet[this.props.league][whatToMaximize].Atk, this.state[name].AtkStage, this.props.pokemonTable,
                    "Atk", this.state[name].IsShadow),

                effDef: calculateEffStat(event.value, ivSet[this.props.league][whatToMaximize].Level,
                    ivSet[this.props.league][whatToMaximize].Def, this.state[name].DefStage, this.props.pokemonTable,
                    "Def", this.state[name].IsShadow),

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
                [correspondingStat]: (processInitialStats(event.target.value) !== "0") ? processInitialStats(event.target.value) : undefined,
            }
        });
    }

    onIvChange(event, role) {
        let eff = calculateEffStat(this.state[role].name, this.state[role].Lvl, event.target.value,
            this.state[role][event.target.name + "Stage"], this.props.pokemonTable, event.target.name, this.state[role].IsShadow)
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
                    this.state[role][correspondingStat], event.target.value, this.props.pokemonTable,
                    correspondingStat, this.state[role].IsShadow),
            }
        });
    }

    onMoveAdd(value, attr, category) {
        const pool = category.includes("Charge") ? "chargeMovePool" : "quickMovePool"

        var newMovePool = [...this.state[attr][pool]]
        newMovePool.splice((newMovePool.length - 2), 0, { value: value, title: `${value}*` });
        this.setState({
            [attr]: {
                ...this.state[attr],
                showMenu: false,
                isSelected: undefined,
                [pool]: newMovePool,
                [category]: value,
            }
        });
    }

    onUserPokemonSelect(index, role) {
        let selectedPok = this.props.userPokemon[index]

        //get movepool
        let moves = new MovePoolBuilder();
        moves.createMovePool(selectedPok.Name, this.props.pokemonTable, optionStrings.options.moveSelect)
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
                default:
                    this.onNameChange(event, name.name[0])
                    return
            }
        }

        if (name.category === "userPokemon") {
            this.onUserPokemonSelect(name.index, name.attr)
            return
        }
        let role = event.target.getAttribute ? event.target.getAttribute("attr") : name.props.attr
        let action = event.target.getAttribute ? event.target.getAttribute("action") : name.props.action
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
            stateModified: true,
        });
    }

    onPokemonSubmit(event) {
        this.props.onPokemonAdd({
            pokemon: this.state.pokemon,
            attr: event.target.getAttribute("attr"),
            event: event,
        })
    }

    render() {
        return (
            <div className="matrix-panel m-2">

                <MagicBox open={Boolean(this.props.value.showPokSelect)} onClick={this.props.onClick} attr={this.props.attr}>
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

                            moveList={(this.state.pokemon.isSelected && this.state.pokemon.isSelected.includes("Charge")) ?
                                this.props.chargeMoveList : this.props.quickMoveList}
                            category={this.state.pokemon.isSelected}
                            onClick={this.onClick}
                        />

                        <Button
                            attr={this.props.attr}
                            title={strings.buttons.addpokemon}
                            onClick={this.onPokemonSubmit}
                        />

                    </div>
                </MagicBox>

                <MagicBox open={Boolean(this.props.value.showSavePanel)} onClick={this.props.onClick} attr={this.props.attr}>
                    <SaveMenu attr={this.props.attr} onChange={this.props.onPartySave} />
                </MagicBox>


                <MagicBox open={Boolean(this.props.value.showImportExportPanel)} onClick={this.props.onClick} attr={this.props.attr}>
                    {this.props.value.showImportExportPanel &&
                        <ImportExport
                            type="matrix"
                            initialValue={this.props.value.listForBattle}
                            attr={this.props.attr}
                            onChange={this.props.onImport}
                        />}
                </MagicBox>

                <Counter
                    class="matrix-panel--bolder"
                    value={this.props.value.listForBattle.length}
                    suffix={" / 50 " + strings.title.counter}
                />

                <MatrixPokemonList
                    attr={this.props.attr}
                    pokemonTable={this.props.pokemonTable}
                    moveTable={this.props.moveTable}

                    onPokRedact={this.props.onPokRedact}
                    onPokemonDelete={this.props.onPokemonDelete}
                >
                    {this.props.value.listForBattle}
                </MatrixPokemonList>

                <Button title={strings.buttons.addpokemon}
                    onClick={
                        (event, ...other) => this.props.onChange(event, { name: "showPokSelect", attr: this.props.attr }, ...other)}
                />



                <WithIcon tip={strings.tips.saved}>
                    <Input select name="selectedParty" value={this.props.value.selectedParty}
                        attr={this.props.attr} label={strings.title.savedparties} onChange={this.props.onChange}>
                        {this.props.savedParties}
                    </Input>
                </WithIcon>



                <div className="row justify-content-around m-0 pt-3" >
                    <Button title={strings.buttons.save}
                        onClick={
                            (event, ...other) => this.props.onChange(event, { name: "showSavePanel", attr: this.props.attr }, ...other)}
                    />

                    <Button title={strings.buttons.delete}
                        onClick={
                            (event, ...other) => this.props.onChange(event, { name: "Delete", attr: this.props.attr }, ...other)}
                    />
                </div>


                <div className="row justify-content-center m-0 pt-2" >
                    <Button title={strings.buttons.impExp}
                        onClick={
                            (event, ...other) => this.props.onChange(event, { name: "showImportExportPanel", attr: this.props.attr }, ...other)}
                    />
                </div>


                <div className="matrix-panel--bolder">
                    {strings.tips.matrixPanel}
                </div>

                <Maximizer
                    attr={this.props.attr}
                    category={"defaultStatMaximizer"}
                    value={this.props.value.maximizer}
                    onChange={this.props.onChange}
                />

                <Stages
                    Atk={this.props.value.AtkStage}
                    Def={this.props.value.DefStage}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                    label={strings.title.initialStages}
                    for=""
                />


                <Input select name="Shields" value={this.props.value.Shields}
                    attr={this.props.attr} label={strings.title.shields} onChange={this.props.onChange}>
                    <MenuItem value="0">0</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                </Input>



                <WithIcon tip={<>{strings.tips.strategy.greedy}<br /><br />{strings.tips.strategy.shieldSaving}</>}>
                    <Input select name="IsGreedy" value={this.props.value.IsGreedy}
                        attr={this.props.attr} label={strings.title.strategy} onChange={this.props.onChange}>

                        <MenuItem value="true">{optionStrings.options.strategy.greedy}</MenuItem>
                        <MenuItem value="false">{optionStrings.options.strategy.shieldSaving}</MenuItem>

                    </Input>
                </WithIcon>

                {this.props.enableCheckbox &&
                    <div className="row m-0 mb-1 pt-1">
                        <Switch
                            checked={Boolean(this.props.triple)}
                            onChange={this.props.onChange}
                            name={"triple"}
                            color="primary"
                            label={strings.tips.triple}
                        />

                        <ReactTooltip
                            className={"infoTip"}
                            id={"triple"} effect="solid"
                            place={"top"}
                            multiline={true}
                        >
                            {strings.tips.tripletip}
                        </ReactTooltip>
                        <i data-tip data-for={"triple"} className="align-self-center fas fa-info-circle fa-lg ml-auto mt-2">
                        </i>
                    </div>}
                {this.props.enableCheckbox && <div className="row m-0 p-0 mb-1 pt-1 justify-content-between">

                    <Button
                        title={advisorStrings.advisor.adv}
                        onClick={this.props.onAdvisorSubmit}
                    />

                    <ReactTooltip
                        className={"infoTip"}
                        id={"advisor"} effect="solid"
                        place={"top"}
                        multiline={true}
                    >
                        {advisorStrings.advisor.tip}
                    </ReactTooltip>
                    <i data-tip data-for={"advisor"} className="align-self-center fas fa-info-circle fa-lg ml-auto">
                    </i>
                </div>}

            </div >
        )
    }

}

export default MatrixPanel