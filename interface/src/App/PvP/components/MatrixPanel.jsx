import React from "react";
import Pokemon from "./Pokemon";
import SelectGroup from "./SelectGroup/SelectGroup";
import MaximizerNoSubmit from "./MaximizerRadio/MaximizerNoSubmit"
import MagicBox from "./MagicBox/MagicBox"
import SubmitButton from "./SubmitButton/SubmitButton"
import {
    getCookie, returnMovePool, calculateMaximizedStats, processInitialStats, checkLvl, checkIV, calculateEffStat,
    pokemon, selectCharge, selectQuick
} from '../../../js/indexFunctions.js'
import Stages from "./Stages/Stages";
import MatrixPokemonList from "./MatrixPokemonList/MatrixPokemonList"
import InputAndSubmit from "./InputAndSubmit/InputAndSubmit"
import Counter from "./Counter/Counter"
import Checkbox from "../../RaidsList/Checkbox"

import ReactTooltip from "react-tooltip";
import LocalizedStrings from 'react-localization';
import { locale } from "../../../locale/locale"

let strings = new LocalizedStrings(locale);


class MatrixPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
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
                <div key="strategyTip">
                    {strings.tips.strategy.greedy}
                    <br />
                    <br />
                    {strings.tips.strategy.shieldSaving}
                </div>
            ],
            pokemon: pokemon(strings.tips.nameSearch),
        };

        this.onChange = this.onChange.bind(this);
        this.maximizerSubmit = this.maximizerSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPokemonSubmit = this.onPokemonSubmit.bind(this);
    }

    onClick(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        var role = event.target.getAttribute('attr')
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
        var moves = returnMovePool(event.value, this.props.pokemonTable, strings.options.moveSelect)
        let quick = selectQuick(moves.quickMovePool, this.props.moveTable, event.value, this.props.pokemonTable)
        let charge = selectCharge(moves.chargeMovePool, this.props.moveTable, event.value, this.props.pokemonTable)
        //create default iv set
        var ivSet = calculateMaximizedStats(event.value, this.props.value.maximizer.level, this.props.pokemonTable)
        var whatToMaximize = (this.props.value.maximizer.action === "Default") ? "Default" : this.props.value.maximizer.stat
        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                "name": event.value,
                "quickMovePool": moves.quickMovePool,
                "chargeMovePool": moves.chargeMovePool,
                "QuickMove": quick,
                "ChargeMove1": charge.primaryName,
                "ChargeMove2": charge.secodaryName,
                "Lvl": ivSet[this.props.league][whatToMaximize]["Level"],
                "Atk": ivSet[this.props.league][whatToMaximize]["Atk"],
                "Def": ivSet[this.props.league][whatToMaximize]["Def"],
                "Sta": ivSet[this.props.league][whatToMaximize]["Sta"],
                AtkStage: this.props.value.AtkStage,
                DefStage: this.props.value.DefStage,
                "InitialHP": "0",
                "InitialEnergy": "0",
                "ivSet": { 40: ivSet },
                Shields: this.props.value.Shields,
                IsGreedy: this.props.value.IsGreedy,
                IsShadow: "false",

                effAtk: calculateEffStat(event.value, ivSet[this.props.league][whatToMaximize]["Level"], ivSet[this.props.league][whatToMaximize]["Atk"], 0, this.props.pokemonTable, "Atk", "false"),
                effDef: calculateEffStat(event.value, ivSet[this.props.league][whatToMaximize]["Level"], ivSet[this.props.league][whatToMaximize]["Def"], 0, this.props.pokemonTable, "Def", "false"),
                effSta: calculateEffStat(event.value, ivSet[this.props.league][whatToMaximize]["Level"], ivSet[this.props.league][whatToMaximize]["Sta"], 0, this.props.pokemonTable, "Sta"),

                HP: undefined,
                Energy: undefined,
            }
        });
    }

    onInitialStatsChange(event) {
        var correspondingStat = event.target.name.replace("Initial", '')
        var role = event.target.getAttribute('attr')
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: processInitialStats(event.target.value),
                [correspondingStat]: (processInitialStats(event.target.value) !== "0") ? processInitialStats(event.target.value) : undefined,
            }
        });
    }

    onIvChange(event) {
        var role = event.target.getAttribute('attr')
        var eff = calculateEffStat(this.state[role].name, this.state[role].Lvl, event.target.value, this.state[role][event.target.name + "Stage"], this.props.pokemonTable, event.target.name, this.state[role].IsShadow)
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkIV(event.target.value) + "",
                ["eff" + event.target.name]: eff
            }
        });
    }

    onLevelChange(event) {
        var role = event.target.getAttribute('attr')
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkLvl(event.target.value) + "",
                effAtk: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Atk, this.state[role].AtkStage, this.props.pokemonTable, "Atk", this.state[role].IsShadow),
                effDef: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Def, this.state[role].DefStage, this.props.pokemonTable, "Def", this.state[role].IsShadow),
                effSta: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Sta, 0, this.props.pokemonTable, "Sta"),
            }
        });
    }

    onTypeChange(event) {
        var role = event.target.getAttribute('attr')
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                effAtk: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Atk, this.state[role].AtkStage, this.props.pokemonTable, "Atk", event.target.value),
                effDef: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Def, this.state[role].DefStage, this.props.pokemonTable, "Def", event.target.value),
                effSta: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Sta, 0, this.props.pokemonTable, "Sta"),
            }
        });
    }

    onStageChange(event) {
        var role = event.target.getAttribute('attr')
        var correspondingStat = event.target.name.replace("Stage", '')
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                ["eff" + correspondingStat]: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role][correspondingStat], event.target.value, this.props.pokemonTable, correspondingStat, this.state[role].IsShadow),
            }
        });
    }

    onMoveAdd(value, attr, category) {
        switch (category.includes("Charge")) {
            case true:
                var newMovePool = [...this.state[attr].chargeMovePool]
                newMovePool.splice((newMovePool.length - 2), 0, <option value={value} key={value}>{value}</option>);
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
                newMovePool.splice((newMovePool.length - 2), 0, <option value={value} key={value}>{value}</option>);
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

    onChange(event, name) {
        //check if it`s a name change
        if (event.target === undefined) {
            switch (name.name[1]) {
                case "QuickMove":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    break
                case "ChargeMove1":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    break
                case "ChargeMove2":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    break
                default:
                    this.onNameChange(event, name.name[0])
                    break
            }


            return
        }
        //check if it's an initial stat change
        if (event.target.name === "InitialHP" || event.target.name === "InitialEnergy") {
            this.onInitialStatsChange(event)
            return
        }
        //check if it's an iv change
        if (event.target.name === "Sta" || event.target.name === "Def" || event.target.name === "Atk") {
            this.onIvChange(event)
            return
        }
        //check if it's an level change
        if (event.target.name === "Lvl") {
            this.onLevelChange(event)
            return
        }
        //if it's an stage change
        if (event.target.name === "AtkStage" || event.target.name === "DefStage") {
            this.onStageChange(event)
            return
        }
        if (event.target.value === "Select...") {
            var role = event.target.getAttribute('attr')
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
            this.onTypeChange(event)
            return
        }
        //otherwise follow general pattern
        role = event.target.getAttribute('attr')
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value
            }
        });
    }



    maximizerSubmit(event) {
        event.preventDefault();

        var role = event.target.getAttribute('attr')
        var level = event.target.getAttribute('level')
        var stat = event.target.getAttribute('stat')
        var action = event.target.getAttribute('action')
        var varIVS = {}

        //if there is no data for given level - generate it
        if (this.state[role]["ivSet"][level] === undefined) {
            var missingLevel = calculateMaximizedStats(this.state[role].name, level, this.props.pokemonTable)
            switch (action) {
                case "Maximize":
                    varIVS = missingLevel[this.props.league][stat]
                    break
                default:
                    varIVS = missingLevel[this.props.league][action]
                    break
            }
            this.setState({
                [role]: {
                    ...this.state[role],
                    HP: undefined,
                    Energy: undefined,

                    "Lvl": varIVS.Level,
                    "Atk": varIVS.Atk,
                    "Def": varIVS.Def,
                    "Sta": varIVS.Sta,
                    effAtk: calculateEffStat(this.state[role].name, varIVS.Level, varIVS.Atk, this.state[role].AtkStage, this.props.pokemonTable, "Atk", this.state[role].IsShadow),
                    effDef: calculateEffStat(this.state[role].name, varIVS.Level, varIVS.Def, this.state[role].DefStage, this.props.pokemonTable, "Def", this.state[role].IsShadow),
                    effSta: calculateEffStat(this.state[role].name, varIVS.Level, varIVS.Sta, 0, this.props.pokemonTable, "Sta"),
                    "ivSet": {
                        ...this.state[role]["ivSet"],
                        [level]: missingLevel,
                    }
                }
            });
            return
        }

        switch (action) {
            case "Maximize":
                varIVS = this.state[role]["ivSet"][level][this.props.league][stat]
                break
            default:
                varIVS = this.state[role]["ivSet"][level][this.props.league][action]
                break
        }
        this.setState({
            [role]: {
                ...this.state[role],
                HP: undefined,
                Energy: undefined,

                effAtk: calculateEffStat(this.state[role].name, varIVS.Level, varIVS.Atk, this.state[role].AtkStage, this.props.pokemonTable, "Atk", this.state[role].IsShadow),
                effDef: calculateEffStat(this.state[role].name, varIVS.Level, varIVS.Def, this.state[role].DefStage, this.props.pokemonTable, "Def", this.state[role].IsShadow),
                effSta: calculateEffStat(this.state[role].name, varIVS.Level, varIVS.Sta, 0, this.props.pokemonTable, "Sta"),

                "Lvl": varIVS.Level,
                "Atk": varIVS.Atk,
                "Def": varIVS.Def,
                "Sta": varIVS.Sta,
            }
        });

    }

    onPokemonSubmit(event) {
        event.preventDefault();
        if (this.state.pokemon.name === strings.tips.nameSearch) {
            return
        }
        this.props.onPokemonAdd({
            pokemon: this.state.pokemon,
            attr: event.target.getAttribute('attr'),
            event: event,
        })
    }

    render() {
        return (
            <div className="pokemon m-2">
                {(this.props.value.showPokSelect) && <MagicBox
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={
                        <div className="row justify-content-center">
                            <Pokemon
                                className="pokemon large m-1 mb-3 col-12"

                                maximzierDefaultOptions={this.props.value.maximizer}

                                pokemonTable={this.props.pokemonTable}
                                moveTable={this.props.moveTable}
                                value={this.state.pokemon}
                                attr="pokemon"
                                onChange={this.onChange}
                                pokList={this.props.pokList}
                                maximizerSubmit={this.maximizerSubmit}

                                showMenu={this.state.pokemon.showMenu}

                                moveList={(this.state.pokemon.isSelected && this.state.pokemon.isSelected.includes("Charge")) ? this.props.chargeMoveList : this.props.quickMoveList}
                                category={this.state.pokemon.isSelected}
                                onClick={this.onClick}
                            />
                            <SubmitButton
                                class="matrixButton btn btn-primary btn-sm p-0 m-0  mx-1"
                                attr={this.props.attr}
                                action={"Add pokemon"}
                                label={strings.buttons.addpokemon}
                                onSubmit={this.onPokemonSubmit}
                            />
                        </div>
                    }
                />}

                {this.props.value.showSavePanel && <MagicBox
                    onClick={this.props.onClick}
                    attr={this.props.attr}
                    element={
                        <InputAndSubmit
                            action="Save party"
                            tip={strings.tips.savegroup}
                            errortext={strings.errors.savegroup}
                            placeholder={strings.title.savegroupplaceholder}
                            label={strings.buttons.savegroup}
                            attr={this.props.attr}
                            onChange={this.props.onPartyChange}
                        />
                    }
                />}
                <Counter
                    class="defaultFont"
                    value={this.props.value.listToDisplay.length}
                    suffix={" / 50 " + strings.title.counter}
                />

                <MatrixPokemonList
                    list={this.props.value.listToDisplay}
                />

                <SubmitButton
                    class="matrixButton btn btn-primary btn-sm mt-0  mx-0"
                    attr={this.props.attr}
                    action="Add pokemon"
                    label={strings.buttons.addpokemon}
                    stat={"showPokSelect"}
                    onSubmit={this.props.onChange}
                />

                <SelectGroup
                    class="input-group input-group-sm mt-1"
                    name="selectedParty"
                    value={this.props.value.selectedParty}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                    options={this.props.savedParties}
                    label={strings.title.savedparties}
                    for=''
                />
                <div className="row  justify-content-around mx-0 px-0 pb-0 padding325" >

                    <SubmitButton
                        class="saveinterface btn btn-primary btn-sm mx-0 col-5"
                        attr={this.props.attr}
                        stat={"showSavePanel"}
                        action="Save"
                        label={strings.buttons.save}
                        onSubmit={this.props.onChange}
                    />


                    <SubmitButton
                        class="saveinterface btn btn-primary btn-sm mx-0 col-5"
                        attr={this.props.attr}
                        action={"Delete"}
                        label={strings.buttons.delete}
                        onSubmit={this.props.onChange} />
                </div>
                <div className="defaultFont">
                    {strings.tips.matrixPanel}
                </div>
                <MaximizerNoSubmit
                    attr={this.props.attr}
                    action={"defaultStatMaximizer"}
                    value={this.props.value.maximizer}
                    onChange={this.props.onChange}
                />




                <Stages
                    Atk={this.props.value.AtkStage}
                    Def={this.props.value.DefStage}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                    options={this.state.stagesList}
                    label={strings.title.initialStages}
                    for=''
                />

                <SelectGroup
                    name="Shields"
                    value={this.props.value.Shields}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                    options={this.state.shieldsList}
                    label={strings.title.shields}
                    for=''
                />
                <SelectGroup
                    name="IsGreedy"
                    value={this.props.value.IsGreedy}
                    attr={this.props.attr}
                    onChange={this.props.onChange}
                    options={this.state.stratigiesList}
                    label={strings.title.strategy}

                    place={((this.props.attr === "leftPanel") ? 'right' : 'left')}
                    for={((this.props.attr === "leftPanel") ? 'strategyL' : 'strategyR')}
                    tip={this.state.strategyTip}
                    tipClass='strategyTips'
                />

                {this.props.enableCheckbox && <Checkbox
                    class={"form-check form-check-inline m-0 p-0 ml-4"}
                    checked={this.props.triple ? "checked" : false}
                    name={"triple"}
                    label={
                        <div className=" text-center">
                            {"Triple battle"}
                            <i data-tip data-for={"triple"} className="fas fa-info-circle ml-1">
                                <ReactTooltip
                                    className={"infoTip"}
                                    id={"triple"} effect='solid'
                                    place={"top"}
                                    multiline={true}
                                >
                                    {strings.tips.pvpoke}
                                </ReactTooltip>
                            </i>
                        </div>
                    }
                    onChange={this.props.onChange}
                />}
            </div>
        )
    }

}

export default MatrixPanel