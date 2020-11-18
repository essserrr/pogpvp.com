import React from "react";

import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import SaveIcon from '@material-ui/icons/Save';

import Pokemon from "./Pokemon";
import MagicBox from "./MagicBox/MagicBox"
import Button from "App/Components/Button/Button";

import { MovePoolBuilder } from "js/movePoolBuilder";
import { calculateEffStat } from "js/indexFunctions";
import { calculateMaximizedStats } from "js/Maximizer/Maximizer";
import { processInitialStats } from "js/checks/processInitialStats";
import { checkLvl } from "js/checks/checkLvl";
import { checkIV } from "js/checks/checkIV";
import { selectQuick } from "js/MoveSelector/selectQuick";
import { selectCharge } from "js/MoveSelector/selectCharge";
import { getCookie } from "js/getCookie";
import { options } from "locale/Components/Options/locale";
import { pvp } from "locale/Pvp/Pvp";

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);

class EditPokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        //get movepool
        let moves = new MovePoolBuilder();
        moves.createMovePool(props.redact.pokemon.name, props.pokemonTable, optionStrings.options.moveSelect, false,
            [props.redact.pokemon.QuickMove], [props.redact.pokemon.ChargeMove1, props.redact.pokemon.ChargeMove2])
        //create default iv set
        let ivSet = calculateMaximizedStats(props.redact.pokemon.name, props.value.maximizer.level, props.pokemonTable)
        let whatToMaximize = (props.value.maximizer.action === "Default") ? "Default" : props.value.maximizer.stat

        this.state = {
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
        const ivSet = calculateMaximizedStats(value, this.state.pokemon.maximizer.level, this.props.pokemonTable)
        const whatToMaximize = (this.state.pokemon.maximizer.action === "Default") ? "Default" : this.state.pokemon.maximizer.stat
        const selectedSet = ivSet[this.props.league][whatToMaximize]
        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                name: value,

                quickMovePool: moves.quickMovePool, chargeMovePool: moves.chargeMovePool,

                QuickMove: quick, ChargeMove1: charge.primaryName, ChargeMove2: charge.secodaryName,

                Lvl: selectedSet.Level,
                Atk: selectedSet.Atk,
                Def: selectedSet.Def,
                Sta: selectedSet.Sta,

                effAtk: calculateEffStat(value, selectedSet.Level, selectedSet.Atk, this.state[name].AtkStage,
                    this.props.pokemonTable, "Atk", this.state[name].IsShadow),

                effDef: calculateEffStat(value, selectedSet.Level, selectedSet.Def, this.state[name].DefStage,
                    this.props.pokemonTable, "Def", this.state[name].IsShadow),

                effSta: calculateEffStat(value, selectedSet.Level, selectedSet.Sta, 0, this.props.pokemonTable, "Sta"),

                HP: undefined, Energy: undefined,
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
        const pool = category.includes("Charge") ? "chargeMovePool" : "quickMovePool"
        let newMovePool = [...this.state[attr][pool]];

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

    onChange(event, atrributes, eventItem, ...other) {
        const attr = atrributes.attr;
        const name = atrributes.name;
        const category = atrributes.category;

        //check if it`s a name change
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
        });
    }

    onPokemonSubmit(event) {
        this.props.onPokemonAdd({
            pokemon: this.state.pokemon,
        })
    }

    render() {
        return (
            <MagicBox open={true} onClick={this.props.onClick} attr={this.props.redact.attr}>
                <Grid container justify="center" spacing={2}>

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

                            moveList={(this.state.pokemon.isSelected && this.state.pokemon.isSelected.includes("Charge")) ? this.props.chargeMoveList : this.props.quickMoveList}
                            category={this.state.pokemon.isSelected}
                            onClick={this.onClick}
                        />
                    </Grid>

                    <Grid item xs="auto">
                        <Button
                            endIcon={<SaveIcon />}
                            title={strings.buttons.submitchange}
                            onClick={this.onPokemonSubmit}
                        />
                    </Grid>

                </Grid>
            </MagicBox>
        )
    }

}

export default EditPokemon;

EditPokemon.propTypes = {
    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
    userPokemon: PropTypes.arrayOf(PropTypes.object),

    pokList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),
    chargeMoveList: PropTypes.arrayOf(PropTypes.object),

    league: PropTypes.string,

    value: PropTypes.object,

    redact: PropTypes.object,

    onClick: PropTypes.func,
    onPokemonAdd: PropTypes.func,
};