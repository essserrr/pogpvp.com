import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";
import Button from "App/Components/Button/Button";
import DefaultIconStyle from "App/Components/WithIcon/DefaultIconStyle";

import Switch from "App/Components/Switch/Switch";
import Pokemon from "./Pokemon";
import Maximizer from "./Maximizer/Maximizer";
import MagicBox from "./MagicBox/MagicBox";

import ImportExport from "./ImportExport/ImportExport";
import Stages from "./Stages/Stages";
import MatrixPokemonList from "./MatrixPokemonList/MatrixPokemonList";
import SaveMenu from "./SaveMenu/SaveMenu";

import { MovePoolBuilder } from "js/movePoolBuilder";
import { calculateMaximizedStats, processInitialStats, checkLvl, checkIV, calculateEffStat, pokemon, } from "js/indexFunctions.js";
import { selectQuick } from "js/MoveSelector/selectQuick";
import { selectCharge } from "js/MoveSelector/selectCharge";
import { getCookie } from "js/getCookie";
import { pvp } from "locale/Pvp/Pvp";
import { options } from "locale/Components/Options/locale";
import { advisor } from "locale/Pvp/Advisor/Advisor";

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


    onClick(event, attributes) {
        this.setState({
            [attributes.attr]: {
                ...this.state[attributes.attr],
                showMenu: false,
                isSelected: undefined,

            }
        });
    }

    onNameChange(value, name) {
        //get movepool
        let moves = new MovePoolBuilder();
        moves.createMovePool(value, this.props.pokemonTable, optionStrings.options.moveSelect)

        const quick = selectQuick(moves.quickMovePool, this.props.moveTable, value, this.props.pokemonTable)
        const charge = selectCharge(moves.chargeMovePool, this.props.moveTable, value, this.props.pokemonTable)

        //create default iv set
        const ivSet = calculateMaximizedStats(value, this.state.pokemon.maximizer.level, this.props.pokemonTable);
        const whatToMaximize = (this.state.pokemon.maximizer.action === "Default") ? "Default" : this.state.pokemon.maximizer.stat;
        const selectedSet = ivSet[this.props.league][whatToMaximize];

        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                name: value,

                quickMovePool: moves.quickMovePool, chargeMovePool: moves.chargeMovePool,

                QuickMove: quick, ChargeMove1: charge.primaryName, ChargeMove2: charge.secodaryName,

                Lvl: selectedSet.Level, Atk: selectedSet.Atk, Def: selectedSet.Def, Sta: selectedSet.Sta,

                effAtk: calculateEffStat(value, selectedSet.Level, selectedSet.Atk, this.state[name].AtkStage, this.props.pokemonTable,
                    "Atk", this.state[name].IsShadow),

                effDef: calculateEffStat(value, selectedSet.Level, selectedSet.Def, this.state[name].DefStage, this.props.pokemonTable,
                    "Def", this.state[name].IsShadow),

                effSta: calculateEffStat(value, selectedSet.Level, selectedSet.Sta, 0, this.props.pokemonTable, "Sta"),

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
        var newMovePool = [...this.state[attr][pool]];

        if (!newMovePool.some(e => e.value === value)) {
            newMovePool.splice((newMovePool.length - 2), 0, { value: value, title: `${value}*` });
        }

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
        const selectedPok = this.props.userPokemon[index]

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

    onChange(event, atrributes, eventItem, ...other) {
        const attr = atrributes.attr;
        const name = atrributes.name;
        const category = atrributes.category;

        if (eventItem && (eventItem.value !== undefined || eventItem.index !== undefined)) {
            switch (name) {
                case "Name":
                    this.onNameChange(eventItem.value, attr)
                    return
                case "userPokemon":
                    this.onUserPokemonSelect(eventItem.index, attr)
                    return
                default:
                    this.onMoveAdd(eventItem.value, attr, name)
                    return
            }
        }

        if (category === "defaultStatMaximizer") {
            this.statMaximizer(event, attr)
            return
        }

        if (event.target.value === "Select...") {
            this.setState({
                [attr]: {
                    ...this.state[attr],
                    showMenu: true,
                    isSelected: name,
                },
            });
            return
        }

        if (name === "InitialHP" || name === "InitialEnergy") {
            this.onInitialStatsChange(event, attr)
            return
        }

        if (name === "Sta" || name === "Def" || name === "Atk") {
            this.onIvChange(event, attr)
            return
        }

        if (name === "Lvl") {
            this.onLevelChange(event, attr)
            return
        }

        if (name === "AtkStage" || name === "DefStage") {
            this.onStageChange(event, attr)
            return
        }

        if (name === "IsShadow") {
            this.onTypeChange(event, attr)
            return
        }

        this.setState({
            [attr]: {
                ...this.state[attr],
                [name]: event.target.value
            },
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
            attr: this.props.attr,
            event: event,
        })
    }

    render() {
        return (
            <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
                <Grid container justify="center" spacing={1}>

                    <MagicBox open={Boolean(this.props.value.showPokSelect)} onClick={this.props.onClick} attr={this.props.attr}>
                        <Grid container spacing={2} justify="center">

                            <Grid item xs={12}>
                                <Pokemon
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
                            </Grid>

                            <Grid item xs="auto">
                                <Button title={strings.buttons.addpokemon} onClick={this.onPokemonSubmit} />
                            </Grid>

                        </Grid>
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

                    <Grid item xs={12}>
                        <Typography variant="h6">
                            {`${this.props.value.listForBattle.length}/50 ${strings.title.counter}`}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <MatrixPokemonList
                            attr={this.props.attr}
                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.moveTable}

                            onPokRedact={this.props.onPokRedact}
                            onPokemonDelete={this.props.onPokemonDelete}
                        >
                            {this.props.value.listForBattle}
                        </MatrixPokemonList>
                    </Grid>

                    <Grid item xs="auto">
                        <Button title={strings.buttons.addpokemon} endIcon={<AddIcon />}
                            onClick={
                                (event, ...other) => this.props.onChange(event, { name: "showPokSelect", attr: this.props.attr }, ...other)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <WithIcon tip={strings.tips.saved}>
                            <Input select name="selectedParty" value={this.props.value.selectedParty}
                                attr={this.props.attr} label={strings.title.savedparties} onChange={this.props.onChange}>
                                {this.props.savedParties}
                            </Input>
                        </WithIcon>
                    </Grid>

                    <Grid item xs={12} container justify="space-around" wrap="nowrap">
                        <Button title={<SaveIcon />}
                            onClick={
                                (event, ...other) => this.props.onChange(event, { name: "showSavePanel", attr: this.props.attr }, ...other)}
                        />

                        <Button title={<DeleteIcon />}
                            onClick={
                                (event, ...other) => this.props.onChange(event, { name: "Delete", attr: this.props.attr }, ...other)}
                        />
                    </Grid>

                    <Grid item xs="auto">
                        <Button title={strings.buttons.impExp}
                            onClick={
                                (event, ...other) => this.props.onChange(event, { name: "showImportExportPanel", attr: this.props.attr }, ...other)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Maximizer
                            attr={this.props.attr}
                            category={"defaultStatMaximizer"}
                            value={this.props.value.maximizer}
                            onChange={this.props.onChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Stages
                            Atk={this.props.value.AtkStage}
                            Def={this.props.value.DefStage}
                            attr={this.props.attr}
                            onChange={this.props.onChange}
                            label={strings.title.initialStages}
                            for=""
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Input select name="Shields" value={this.props.value.Shields}
                            attr={this.props.attr} label={strings.title.shields} onChange={this.props.onChange}>
                            <MenuItem value="0">0</MenuItem>
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                        </Input>
                    </Grid>

                    <Grid item xs={12}>
                        <WithIcon tip={<>{strings.tips.strategy.greedy}<br /><br />{strings.tips.strategy.shieldSaving}</>}>
                            <Input select name="IsGreedy" value={this.props.value.IsGreedy}
                                attr={this.props.attr} label={strings.title.strategy} onChange={this.props.onChange}>

                                <MenuItem value="true">{optionStrings.options.strategy.greedy}</MenuItem>
                                <MenuItem value="false">{optionStrings.options.strategy.shieldSaving}</MenuItem>

                            </Input>
                        </WithIcon>
                    </Grid>

                    {this.props.enableCheckbox &&
                        <Grid item xs={12} container justify="space-between" alignItems="center" wrap="nowrap">
                            <Switch
                                checked={Boolean(this.props.triple)}
                                onChange={this.props.onChange}
                                name={"triple"}
                                color="primary"
                                label={strings.tips.triple}
                            />

                            <Tooltip arrow placement="top" title={<Typography>{strings.tips.tripletip}</Typography>}>
                                <DefaultIconStyle>
                                    <HelpOutlineIcon />
                                </DefaultIconStyle>
                            </Tooltip>
                        </Grid>}

                    {this.props.enableCheckbox &&
                        <Grid item xs={12} container justify="space-between" alignItems="center" wrap="nowrap">
                            <Button
                                title={advisorStrings.advisor.adv}
                                onClick={this.props.onAdvisorSubmit}
                                disabled={this.props.advDisabled}
                            />
                            <Tooltip arrow placement="top" title={<Typography>{advisorStrings.advisor.tip}</Typography>}>
                                <DefaultIconStyle>
                                    <HelpOutlineIcon />
                                </DefaultIconStyle>
                            </Tooltip>
                        </Grid>}

                </Grid>
            </GreyPaper>
        )
    }

}

export default MatrixPanel;

MatrixPanel.propTypes = {
    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    userPokemon: PropTypes.arrayOf(PropTypes.object),

    pokList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),
    chargeMoveList: PropTypes.arrayOf(PropTypes.object),
    savedParties: PropTypes.arrayOf(PropTypes.object),

    league: PropTypes.string,

    enableCheckbox: PropTypes.bool,
    triple: PropTypes.bool,
    advDisabled: PropTypes.bool,
    onAdvisorSubmit: PropTypes.func,

    value: PropTypes.object,

    attr: PropTypes.string,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onPokemonAdd: PropTypes.func,
    onPokRedact: PropTypes.func,
    onPokemonDelete: PropTypes.func,

    onPartySave: PropTypes.func,
    onImport: PropTypes.func,
};