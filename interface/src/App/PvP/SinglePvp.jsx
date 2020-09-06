import React from "react";
import Pokemon from "./components/Pokemon";
import Result from "./components/Result";
import SubmitButton from "./components/SubmitButton/SubmitButton"
import {
    calculateEffStat, pokemon, encodeQueryData, returnMovePool, calculateMaximizedStats, processHP,
    processInitialStats, getRoundFromString, checkLvl, checkIV, selectCharge, selectQuick
} from "../../js/indexFunctions.js"
import { getCookie } from "../../js/getCookie"
import Reconstruction from "./components/PvpReconstruction/Reconstruction.jsx"
import Errors from "./components/Errors/Errors"
import Indicators from "./components/Indicators/Indicators"
import URL from "./components/URL/URL"
import MagicBox from "./components/MagicBox/MagicBox"
import Constructor from "./components/Constructor/Constructor"
import Loader from "../PvpRating/Loader"

import LocalizedStrings from "react-localization";
import { locale } from "../../locale/locale"

let strings = new LocalizedStrings(locale);


class SinglePvp extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            attacker: (this.props.parentState.attacker) ? this.props.parentState.attacker : pokemon(strings.tips.nameSearch),
            defender: (this.props.parentState.defender) ? this.props.parentState.defender : pokemon(strings.tips.nameSearch),
            result: (this.props.parentState.pvpResult) ? this.props.parentState.pvpResult : [],
            url: (this.props.parentState.url) ? this.props.parentState.url : "",

            error: this.props.parentState.error,
            showResult: this.props.parentState.showResult,
            isError: this.props.parentState.isError,

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
                attacker: (this.props.parentState.attacker) ? this.props.parentState.attacker : pokemon(strings.tips.nameSearch),
                defender: (this.props.parentState.defender) ? this.props.parentState.defender : pokemon(strings.tips.nameSearch),
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
        if (this.props.parentState.league !== prevProps.parentState.league && this.props.parentState.pokemonTable) {
            if (this.props.parentState.pokemonTable[this.state.attacker.name]) {
                this.statMaximizer({ target: { name: "", value: "" } }, "attacker")
            }
            if (this.props.parentState.pokemonTable[this.state.defender.name]) {
                this.statMaximizer({ target: { name: "", value: "" } }, "defender")
            }
            return
        }
    }

    onNameChange(event, name) {

        //get movepool
        let moves = returnMovePool(event.value, this.props.parentState.pokemonTable, strings.options.moveSelect)
        let quick = selectQuick(moves.quickMovePool, this.props.parentState.moveTable, event.value, this.props.parentState.pokemonTable)
        let charge = selectCharge(moves.chargeMovePool, this.props.parentState.moveTable, event.value, this.props.parentState.pokemonTable)
        //create default iv set
        let ivSet = calculateMaximizedStats(event.value, 40.0, this.props.parentState.pokemonTable)
        let whatToMaximize = (this.state[name].maximizer.action === "Default") ? "Default" : this.state[name].maximizer.stat

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
                Lvl: ivSet[this.props.parentState.league][whatToMaximize].Level,
                Atk: ivSet[this.props.parentState.league][whatToMaximize].Atk,
                Def: ivSet[this.props.parentState.league][whatToMaximize].Def,
                Sta: ivSet[this.props.parentState.league][whatToMaximize].Sta,

                effAtk: calculateEffStat(event.value, ivSet[this.props.parentState.league][whatToMaximize].Level,
                    ivSet[this.props.parentState.league][whatToMaximize].Atk,
                    this.state[name].AtkStage, this.props.parentState.pokemonTable,
                    "Atk", this.state[name].IsShadow),

                effDef: calculateEffStat(event.value, ivSet[this.props.parentState.league][whatToMaximize].Level,
                    ivSet[this.props.parentState.league][whatToMaximize].Def,
                    this.state[name].DefStage, this.props.parentState.pokemonTable,
                    "Def", this.state[name].IsShadow),

                effSta: calculateEffStat(event.value, ivSet[this.props.parentState.league][whatToMaximize].Level,
                    ivSet[this.props.parentState.league][whatToMaximize].Sta, 0, this.props.parentState.pokemonTable, "Sta"),

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
            this.state[role][event.target.name + "Stage"], this.props.parentState.pokemonTable, event.target.name, this.state[role].IsShadow)
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
                [event.target.name]: checkLvl(event.target.value) + "",
                effAtk: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Atk, this.state[role].AtkStage, this.props.parentState.pokemonTable, "Atk", this.state[role].IsShadow),
                effDef: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Def, this.state[role].DefStage, this.props.parentState.pokemonTable, "Def", this.state[role].IsShadow),
                effSta: calculateEffStat(this.state[role].name, event.target.value, this.state[role].Sta, 0, this.props.parentState.pokemonTable, "Sta"),
            },
            stateModified: true,
        });
    }

    onTypeChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
                effAtk: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Atk, this.state[role].AtkStage, this.props.parentState.pokemonTable, "Atk", event.target.value),
                effDef: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Def, this.state[role].DefStage, this.props.parentState.pokemonTable, "Def", event.target.value),
                effSta: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role].Sta, 0, this.props.parentState.pokemonTable, "Sta"),
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
                ["eff" + correspondingStat]: calculateEffStat(this.state[role].name, this.state[role].Lvl, this.state[role][correspondingStat], event.target.value, this.props.parentState.pokemonTable, correspondingStat, this.state[role].IsShadow),
            },
            stateModified: true,
        });
    }

    onMoveAdd(value, attr, category) {
        switch (category.includes("Charge")) {
            case true:
                var newMovePool = [...this.state[attr].chargeMovePool]

                newMovePool.splice((newMovePool.length - 2), 0, <option value={value} key={value}>{value + "*"}</option>);
                this.setState({
                    [attr]: {
                        ...this.state[attr],
                        showMenu: false,
                        isSelected: undefined,
                        chargeMovePool: newMovePool,
                        [category]: value,
                    },
                    stateModified: true,
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
                    },
                    stateModified: true,
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
                },
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
            },
            stateModified: true,
        });
    }

    statMaximizer(event, role) {
        let max = {
            ...this.state[role].maximizer,
            [event.target.name]: event.target.value,
        }

        let ivSet = calculateMaximizedStats(this.state[role].name, max.level, this.props.parentState.pokemonTable)
        let whatToMaximize = (max.action === "Default") ? "Default" : max.stat

        this.setState({
            [role]: {
                ...this.state[role],
                HP: undefined, Energy: undefined,

                Lvl: ivSet[this.props.parentState.league][whatToMaximize].Level,
                Atk: ivSet[this.props.parentState.league][whatToMaximize].Atk,
                Def: ivSet[this.props.parentState.league][whatToMaximize].Def,
                Sta: ivSet[this.props.parentState.league][whatToMaximize].Sta,

                effAtk: calculateEffStat(this.state[role].name, ivSet[this.props.parentState.league][whatToMaximize].Level,
                    ivSet[this.props.parentState.league][whatToMaximize].Atk, this.state[role].AtkStage,
                    this.props.parentState.pokemonTable, "Atk", this.state[role].IsShadow),

                effDef: calculateEffStat(this.state[role].name, ivSet[this.props.parentState.league][whatToMaximize].Level,
                    ivSet[this.props.parentState.league][whatToMaximize].Def, this.state[role].DefStage,
                    this.props.parentState.pokemonTable, "Def", this.state[role].IsShadow),

                effSta: calculateEffStat(this.state[role].name, ivSet[this.props.parentState.league][whatToMaximize].Level,
                    ivSet[this.props.parentState.league][whatToMaximize].Sta, 0,
                    this.props.parentState.pokemonTable, "Sta"),

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
        let dataFor = event.target.getAttribute("data-for")
        let id = event.target.id
        let extractedNumber
        let round
        switch (true) {
            case Boolean(dataFor):
                extractedNumber = getRoundFromString(dataFor.slice(0, 4))
                if (extractedNumber === "") {
                    return
                }
                round = this.state.result.Log[extractedNumber - 1]
                break
            case Boolean(id):
                extractedNumber = getRoundFromString(event.target.id.slice(0, 4))
                if (extractedNumber === "") {
                    return
                }
                round = this.state.result.Log[extractedNumber - 1]
                break
            default:
                return
        }

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
        let dataFor = event.currentTarget.getAttribute("data-for")
        let extractedNumber
        switch (true) {
            case Boolean(dataFor):
                extractedNumber = getRoundFromString(dataFor.slice(0, 4))
                if (extractedNumber === "") {
                    return
                }
                break
            default:
                return
        }
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

    onClick(event) {
        let role = event.target.getAttribute("attr")
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }

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
        return (
            < >
                {(this.state.constructor.showMenu) && <MagicBox
                    onClick={this.onClick}
                    attr={"constructor"}
                    element={<Constructor
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
                />}

                <div className="row justify-content-between mb-4"  >
                    <div className="results order-1 ml-1 mx-lg-0 mt-1  mt-md-2" >
                        <Pokemon
                            className="pokemon m-2"

                            pokemonTable={this.props.parentState.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            value={this.state.attacker}
                            attr="attacker"
                            onChange={this.onChange}
                            pokList={this.props.parentState.pokList}
                            statMaximizer={this.statMaximizer}

                            showMenu={this.state.attacker.showMenu}

                            moveList={(this.state.attacker.isSelected && this.state.attacker.isSelected.includes("Charge")) ? this.props.parentState.chargeMoveList : this.props.parentState.quickMoveList}
                            category={this.state.attacker.isSelected}
                            onClick={this.onClick}
                        />
                    </div>



                    <div className="overflowing order-3 order-lg-2 col-12 col-lg mt-0 mt-lg-2 px-0" >
                        <div className="row mx-2 h-100"  >
                            {(this.state.showResult || this.state.isError) &&
                                <div className="align-self-start results col-12 order-3 order-lg-1  col-12 mt-3 mt-lg-0 p-2 ">
                                    <div className="row justify-content-center mx-0"  >
                                        <div className="order-2 order-lg-1 col-12 ">
                                            {this.state.showResult &&
                                                <Result value={this.state.result} />}
                                            {this.state.isError && <Errors class="alert alert-danger m-0 p-2" value={this.state.error} />}
                                        </div>
                                        {this.state.url && this.state.showResult && <div className="order-1 order-lg-2 col-12 col-lg-6 mt-2" >
                                            <URL
                                                label={strings.title.url}
                                                for="pvpURLLabel"
                                                tip={<>
                                                    {strings.tips.url.first}
                                                    < br />
                                                    {strings.tips.url.second}
                                                </>}
                                                place="top"
                                                message={strings.tips.url.message}
                                                value={this.state.url}
                                            />
                                        </div>}
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
                                <div className="order-1 order-lg-3 d-flex justify-content-between bd-highligh mx-0 px-0 col-12  mt-2 mt-lg-0" >
                                    <div className="bd-highlight">
                                        {(this.state.attacker.name && this.props.parentState.pokemonTable[this.state.attacker.name]) &&
                                            <Indicators
                                                effSta={this.state.attacker.effSta}
                                                HP={this.state.attacker.HP}

                                                energy={this.state.attacker.Energy}
                                                chargeMove1={this.props.parentState.moveTable[this.state.attacker.ChargeMove1]}
                                                chargeMove2={this.props.parentState.moveTable[this.state.attacker.ChargeMove2]}
                                                attr="Attacker"

                                                attackerTypes={this.props.parentState.pokemonTable[this.state.attacker.name].Type}
                                                defenderTypes={(this.props.parentState.pokemonTable[this.state.defender.name]) ?
                                                    this.props.parentState.pokemonTable[this.state.defender.name].Type : ""}
                                                aAttack={this.state.attacker.effAtk}
                                                dDefence={this.state.defender.effDef}
                                            />}
                                    </div>
                                    <div className="bd-highlight align-self-center">
                                        <SubmitButton
                                            label={strings.buttons.letsbattle}
                                            action="Let's Battle"
                                            onSubmit={this.submitForm}
                                            class="btn btn-primary"
                                        />
                                    </div >
                                    <div className="bd-highlight" >
                                        {(this.state.defender.name && this.props.parentState.pokemonTable[this.state.defender.name]) &&
                                            <Indicators
                                                effSta={this.state.defender.effSta}
                                                HP={this.state.defender.HP}

                                                energy={this.state.defender.Energy}
                                                chargeMove1={this.props.parentState.moveTable[this.state.defender.ChargeMove1]}
                                                chargeMove2={this.props.parentState.moveTable[this.state.defender.ChargeMove2]}
                                                attr="Defender"

                                                attackerTypes={this.props.parentState.pokemonTable[this.state.defender.name].Type}
                                                defenderTypes={(this.props.parentState.pokemonTable[this.state.attacker.name]) ?
                                                    this.props.parentState.pokemonTable[this.state.attacker.name].Type : ""}
                                                aAttack={this.state.defender.effAtk}
                                                dDefence={this.state.attacker.effDef}
                                            />}
                                    </div>
                                </div>

                                {this.state.showResult &&
                                    <div className="order-2 order-lg-4 col-12 px-0  mt-1" >
                                        <Reconstruction
                                            onMouseEnter={this.onMouseEnter}
                                            constructorOn={this.constructorOn}
                                            value={this.state.result}
                                            moveTable={this.props.parentState.moveTable} />
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="results order-2 order-lg-3 mr-1 mx-lg-0 mt-1 mt-md-0 mt-md-2" >
                        <Pokemon
                            className="pokemon m-2"

                            pokemonTable={this.props.parentState.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            value={this.state.defender}
                            attr="defender"
                            onChange={this.onChange}
                            pokList={this.props.parentState.pokList}

                            showMenu={this.state.defender.showMenu}
                            moveList={this.state.defender.isSelected && this.state.defender.isSelected.includes("Charge") ? this.props.parentState.chargeMoveList : this.props.parentState.quickMoveList}
                            category={this.state.defender.isSelected}
                            onClick={this.onClick}
                        />
                    </div>
                </div>

            </ >

        );
    }
}



export default SinglePvp