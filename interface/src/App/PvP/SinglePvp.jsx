import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { withStyles } from "@material-ui/core/styles";

import MiddlePanel from "./components/MiddlePanel/MiddlePanel";
import Pokemon from "./components/Pokemon";
import MagicBox from "./components/MagicBox/MagicBox";
import Constructor from "./components/Constructor/Constructor";

import { MovePoolBuilder } from "js/movePoolBuilder";
import {
    calculateEffStat, pokemon, encodeQueryData, calculateMaximizedStats, processHP,
    processInitialStats, checkLvl, checkIV, selectCharge, selectQuick
} from "js/indexFunctions.js"
import { getCookie } from "js/getCookie";
import { pvp } from "locale/Pvp/Pvp";
import { options } from "locale/Components/Options/locale";

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);

const styles = theme => ({
    pokemon: {
        maxWidth: "208px",
        minWidth: "208px",
    },
    middleRow: {
        maxWidth: "calc(100% - 416px) !important",
        [theme.breakpoints.down('sm')]: {
            maxWidth: "100% !important",
        }
    },
});

class SinglePvp extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            attacker: (props.parentState.attacker) ? props.parentState.attacker : pokemon(),
            defender: (props.parentState.defender) ? props.parentState.defender : pokemon(),
            result: (props.parentState.pvpResult) ? props.parentState.pvpResult : [],
            url: (props.parentState.url) ? props.parentState.url : "",

            error: props.parentState.error,
            showResult: props.parentState.showResult,
            isError: props.parentState.isError,

            loading: false,

            constructor: {
                showMenu: false,
                isSelected: undefined,
            },
            lastChangesAt: 0,
            stateModified: false,
        };
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.statMaximizer = this.statMaximizer.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onClick = this.onClick.bind(this);
        this.constructorOn = this.constructorOn.bind(this);
        this.submitConstructor = this.submitConstructor.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.parentState.pvpResult !== prevProps.parentState.pvpResult) {
            this.setState({
                attacker: (this.props.parentState.attacker) ? this.props.parentState.attacker : pokemon(),
                defender: (this.props.parentState.defender) ? this.props.parentState.defender : pokemon(),
                result: (this.props.parentState.pvpResult) ? this.props.parentState.pvpResult : [],
                url: (this.props.parentState.url) ? this.props.parentState.url : "",

                error: this.props.parentState.error,
                showResult: this.props.parentState.showResult,
                isError: this.props.parentState.isError,

                loading: false,

                constructor: {
                    ...this.state.constructor,
                    showMenu: false,
                    isSelected: undefined,
                    agregatedParams: {},
                },
                lastChangesAt: 0,
                stateModified: false,
            });
            return
        }
        if (this.props.parentState.league !== prevProps.parentState.league && this.props.pokemonTable) {
            if (this.props.pokemonTable[this.state.attacker.name]) {
                this.statMaximizer({ target: { name: "", value: "" } }, "attacker")
            }
            if (this.props.pokemonTable[this.state.defender.name]) {
                this.statMaximizer({ target: { name: "", value: "" } }, "defender")
            }
            return
        }
    }

    onNameChange(value, name) {
        //get movepool
        let moves = new MovePoolBuilder();
        moves.createMovePool(value, this.props.pokemonTable, optionStrings.options.moveSelect)


        const quick = selectQuick(moves.quickMovePool, this.props.parentState.moveTable, value, this.props.pokemonTable)
        const charge = selectCharge(moves.chargeMovePool, this.props.parentState.moveTable, value, this.props.pokemonTable)
        //create default iv set
        const ivSet = calculateMaximizedStats(value, 40.0, this.props.pokemonTable);
        const whatToMaximize = this.state[name].maximizer.action === "Default" ? "Default" : this.state[name].maximizer.stat;
        const selectedSet = ivSet[this.props.parentState.league][whatToMaximize];

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
            },
            stateModified: true,
        });
    }

    onInitialStatsChange(event, role) {
        let correspondingStat = event.target.name.replace("Initial", "")
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: processInitialStats(event.target.value),
                [correspondingStat]: (processInitialStats(event.target.value) !== "0") ? processInitialStats(event.target.value) : undefined,
            },
            stateModified: true,
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
            },
            stateModified: true,
        });
    }

    onLevelChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: String(checkLvl(event.target.value)),
                effAtk: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Atk, this.state[role].AtkStage, this.props.pokemonTable, "Atk", this.state[role].IsShadow),
                effDef: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Def, this.state[role].DefStage, this.props.pokemonTable, "Def", this.state[role].IsShadow),
                effSta: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Sta, 0, this.props.pokemonTable, "Sta"),
            },
            stateModified: true,
        });
    }

    onTypeChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                effAtk: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Atk, this.state[role].AtkStage, this.props.pokemonTable, "Atk", event.target.value),
                effDef: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Def, this.state[role].DefStage, this.props.pokemonTable, "Def", event.target.value),
                effSta: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Sta, 0, this.props.pokemonTable, "Sta"),
            },
            stateModified: true,
        });
    }

    onStageChange(event, role) {
        let correspondingStat = event.target.name.replace("Stage", "")
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                ["eff" + correspondingStat]: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role][correspondingStat], event.target.value, this.props.pokemonTable, correspondingStat, this.state[role].IsShadow),
            },
            stateModified: true,
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
            },
            stateModified: true,
        });
    }

    onUserPokemonSelect(index, role) {
        const selectedPok = this.props.userPokemon[index]
        //get movepool
        let moves = new MovePoolBuilder();
        moves.createMovePool(selectedPok.Name, this.props.pokemonTable, optionStrings.options.moveSelect, false,
            [selectedPok.QuickMove], [selectedPok.ChargeMove, selectedPok.ChargeMove2]);

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
            stateModified: true,
        });
    }

    statMaximizer(event, role) {
        let max = {
            ...this.state[role].maximizer,
            [event.target.name]: event.target.name === "level" ? checkLvl(event.target.value) : event.target.value,
        }

        const ivSet = calculateMaximizedStats(this.state[role].name, max.level, this.props.pokemonTable);
        const whatToMaximize = max.action === "Default" ? "Default" : max.stat;
        const selectedSet = ivSet[this.props.parentState.league][whatToMaximize];

        this.setState({
            [role]: {
                ...this.state[role],
                HP: undefined, Energy: undefined,

                Lvl: selectedSet.Level, Atk: selectedSet.Atk, Def: selectedSet.Def, Sta: selectedSet.Sta,

                effAtk: calculateEffStat(this.state[role].name, selectedSet.Level, selectedSet.Atk, this.state[role].AtkStage,
                    this.props.pokemonTable, "Atk", this.state[role].IsShadow),

                effDef: calculateEffStat(this.state[role].name, selectedSet.Level, selectedSet.Def, this.state[role].DefStage,
                    this.props.pokemonTable, "Def", this.state[role].IsShadow),

                effSta: calculateEffStat(this.state[role].name, selectedSet.Level, selectedSet.Sta, 0, this.props.pokemonTable, "Sta"),

                maximizer: max,
            },
            stateModified: true,
        });
    }


    submitForm = async event => {
        event.preventDefault()
        let url = this.props.parentState.league + "/" + encodeQueryData(this.state.attacker) + "/" + encodeQueryData(this.state.defender)
        this.setState({
            loading: true,
        });
        try {
            const response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/single/" + url, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                    "Pvp-Type": this.props.parentState.pvpoke ? "pvpoke" : "normal",
                },
            })
            //parse answer
            const data = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw data.detail }

            //otherwise set state
            this.props.changeUrl("/pvp/single/" + url + (this.props.parentState.pvpoke ? "/pvpoke" : ""))
            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                result: data,
                attacker: {
                    ...this.state.attacker,
                    HP: processHP(data.Attacker.HP),
                    Energy: data.Attacker.EnergyRemained,
                },
                defender: {
                    ...this.state.defender,
                    HP: processHP(data.Defender.HP),
                    Energy: data.Defender.EnergyRemained,
                },
                url: window.location.href,
                lastChangesAt: 0,
                stateModified: false,
            });
        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e),

                lastChangesAt: 0,
                stateModified: false,
            })
        }
    }

    onMouseEnter(event) {
        const id = event.currentTarget.id
        const extractedNumber = parseInt(id.slice(0, 4), 10);
        const round = this.state.result.Log[extractedNumber - 1]

        this.setState({
            attacker: {
                ...this.state.attacker,
                HP: processHP(round.Attacker.HP),
                Energy: round.Attacker.Energy,
            },
            defender: {
                ...this.state.defender,
                HP: processHP(round.Defender.HP),
                Energy: round.Defender.Energy,
            },
        });
    }

    constructorOn(event) {
        const id = event.currentTarget.id
        const extractedNumber = parseInt(id.slice(0, 4), 10);
        //if it is the last round, return
        if (this.state.result.Log[extractedNumber + 1] === undefined) {
            return
        }

        this.setState({
            constructor: {
                ...this.state.constructor,
                showMenu: true,
                isSelected: extractedNumber,
                agregatedParams: this.agregateShieldStage(extractedNumber)
            }
        })
    }

    agregateShieldStage(round) {
        let result = {
            Attacker: {
                AtkStage: Number(this.state.attacker.AtkStage),
                DefStage: Number(this.state.attacker.DefStage),
                Shields: Number(this.state.attacker.Shields),
            },
            Defender: {
                AtkStage: Number(this.state.defender.AtkStage),
                DefStage: Number(this.state.defender.DefStage),
                Shields: Number(this.state.defender.Shields),
            },
        }

        for (let i = 0; i < round; i++) {
            this.argegate(this.state.result.Log[i].Attacker, result.Attacker, result.Defender)
            this.argegate(this.state.result.Log[i].Defender, result.Defender, result.Attacker)
        }
        return result
    }

    argegate(pok1, dest1, dest2) {
        if (pok1.ShieldIsUsed) {
            dest1.Shields -= 1
        }

        if (pok1.StageA !== 0 || pok1.StageD !== 0) {
            switch (pok1.IsSelf) {
                case true:
                    dest1.AtkStage += pok1.StageA
                    dest1.DefStage += pok1.StageD
                    break
                default:
                    dest2.AtkStage += pok1.StageA
                    dest2.DefStage += pok1.StageD
            }
        }
    }

    setUpConstructorObj(obj, agregatedParams, logParams) {
        obj.InitialHP = String(logParams.HP)
        obj.InitialEnergy = String(logParams.Energy)

        obj.AtkStage = String(agregatedParams.AtkStage)
        obj.DefStage = String(agregatedParams.DefStage)
        obj.Shields = String(agregatedParams.Shields)
    }

    async submitConstructor(constr) {
        this.setState({
            loading: true,
            constructor: {
                ...this.state.constructor,
                showMenu: false,
            },
        })

        let requestObj = { Attacker: { ...this.state.attacker }, Defender: { ...this.state.defender }, Constructor: constr, }
        this.setUpConstructorObj(requestObj.Attacker, this.state.constructor.agregatedParams.Attacker, this.state.result.Log[this.state.constructor.isSelected - 1].Attacker)
        this.setUpConstructorObj(requestObj.Defender, this.state.constructor.agregatedParams.Defender, this.state.result.Log[this.state.constructor.isSelected - 1].Defender)

        try {
            const response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/constructor", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Encoding": "gzip",
                    "Pvp-Type": this.props.parentState.pvpoke ? "pvpoke" : "normal",
                },
                body: JSON.stringify(requestObj)
            })
            //parse answer
            const data = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw data.detail }

            data.Log = [...this.state.result.Log.slice(0, this.state.constructor.isSelected), ...data.Log.slice(1)]

            this.setState({
                showResult: true,
                isError: false,
                loading: false,
                result: data,
                attacker: {
                    ...this.state.attacker,
                    HP: processHP(data.Attacker.HP),
                    Energy: data.Attacker.EnergyRemained,
                },
                defender: {
                    ...this.state.defender,
                    HP: processHP(data.Defender.HP),
                    Energy: data.Defender.EnergyRemained,
                },
                constructor: {
                    ...this.state.constructor,
                    showMenu: false,
                    isSelected: undefined,
                    agregatedParams: {},
                },
                lastChangesAt: this.state.constructor.isSelected,
            })
        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e),
                constructor: {
                    ...this.state.constructor,
                    showMenu: false,
                    isSelected: undefined,
                    agregatedParams: {},
                },
            });
        }
    }

    onClick(event, attributes) {
        const role = attributes.attr;
        console.log(event, attributes)
        if (role === "constructor") {
            this.setState({
                [role]: {
                    ...this.state[role],
                    showMenu: false,
                    isSelected: undefined,
                    agregatedParams: {},
                }
            });
            return
        }

        this.setState({
            [role]: {
                ...this.state[role],
                showMenu: false,
                isSelected: undefined,
            }
        });
    }


    render() {
        const { classes } = this.props;

        return (
            <Grid container justify="space-between" spacing={1}>

                <MagicBox open={Boolean(this.state.constructor.showMenu)} onClick={this.onClick} attr={"constructor"}>
                    {this.state.constructor.showMenu &&
                        <Constructor
                            log={this.state.result.Log}
                            round={this.state.constructor.isSelected}

                            Attacker={this.state.attacker}
                            Defender={this.state.defender}
                            moveTable={this.props.parentState.moveTable}
                            agregatedParams={this.state.constructor.agregatedParams}

                            submitConstructor={this.submitConstructor}

                            lastChangesAt={this.state.lastChangesAt}
                            stateModified={this.state.stateModified}
                        />}
                </MagicBox>

                <Box clone order={{ xs: 1 }}>
                    <Grid item xs="auto" className={classes.pokemon}>
                        <Pokemon
                            value={this.state.attacker}
                            attr="attacker"

                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            moveList={(this.state.attacker.isSelected && this.state.attacker.isSelected.includes("Charge")) ? this.props.parentState.chargeMoveList : this.props.parentState.quickMoveList}
                            pokList={this.props.parentState.pokList}
                            userPokemon={this.props.userPokemon}

                            showMenu={this.state.attacker.showMenu}
                            category={this.state.attacker.isSelected}

                            onChange={this.onChange}
                            statMaximizer={this.statMaximizer}
                            onClick={this.onClick}
                        />
                    </Grid>
                </Box>

                <Box className={classes.middleRow} clone order={{ xs: 3, md: 2 }}>
                    <Grid item xs={12} md>
                        <MiddlePanel
                            attacker={this.state.attacker}
                            defender={this.state.defender}
                            result={this.state.result}

                            moveTable={this.props.parentState.moveTable}
                            pokemonTable={this.props.pokemonTable}

                            url={this.state.url}
                            error={this.state.error}

                            loading={this.state.loading}
                            isError={this.state.isError}
                            showResult={this.state.showResult}

                            constructorOn={this.constructorOn}
                            onMouseEnter={this.onMouseEnter}
                            submitForm={this.submitForm}
                        />
                    </Grid>
                </Box>

                <Box clone order={{ xs: 2, md: 3 }}>
                    <Grid item xs="auto" className={classes.pokemon}>
                        <Pokemon
                            value={this.state.defender}
                            attr="defender"

                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            moveList={this.state.defender.isSelected && this.state.defender.isSelected.includes("Charge") ? this.props.parentState.chargeMoveList : this.props.parentState.quickMoveList}
                            pokList={this.props.parentState.pokList}
                            userPokemon={this.props.userPokemon}

                            showMenu={this.state.defender.showMenu}
                            category={this.state.defender.isSelected}

                            statMaximizer={this.statMaximizer}
                            onChange={this.onChange}
                            onClick={this.onClick}
                        />
                    </Grid>
                </Box>

            </Grid>

        );
    }
}

export default withStyles(styles, { withTheme: true })(SinglePvp);

SinglePvp.propTypes = {
    userPokemon: PropTypes.arrayOf(PropTypes.object),
    pokemonTable: PropTypes.object,

    parentState: PropTypes.object,
    changeUrl: PropTypes.func,
};