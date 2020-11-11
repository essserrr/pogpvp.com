import React from "react"
import LocalizedStrings from "react-localization"

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import SimulatorPanel from "./Components/SimulatorPanel"
import Button from "App/Components/Button/Button"
import PveResult from "./Components/PveResult/PveResult"

import { MovePoolBuilder } from "js/movePoolBuilder"
import { pveattacker, boss, pveobj, encodePveAttacker, encodePveBoss, encodePveObj, checkLvl, checkIV } from "../../js/indexFunctions.js"

import { getCookie } from "../../js/getCookie"
import { locale } from "../../locale/locale"
import { options } from "locale/Components/Options/locale";

import "./CommonPve.scss"

let strings = new LocalizedStrings(locale);
let optionStrings = new LocalizedStrings(options);

class CommonPve extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            attackerObj: (props.parentState.attackerObj) ? props.parentState.attackerObj : pveattacker(),
            bossObj: (props.parentState.bossObj) ? props.parentState.bossObj : boss(),
            pveObj: (props.parentState.pveObj) ? props.parentState.pveObj : pveobj(),
            supportPokemon: (props.parentState.supportPokemon) ? props.parentState.supportPokemon : pveattacker(),

            result: props.parentState.pveResult ? props.parentState.pveResult : [],
            url: props.parentState.url ? props.parentState.url : "",
            date: props.parentState.date ? props.parentState.date : 1,

            error: props.parentState.error,
            showResult: props.parentState.showResult,
            isError: props.parentState.isError,

            loading: false,

            snapshot: {
                attackerObj: props.parentState.attackerObj ? { ...props.parentState.attackerObj } : pveattacker(),
                bossObj: props.parentState.bossObj ? { ...props.parentState.bossObj } : boss(),
                pveObj: props.parentState.pveObj ? { ...props.parentState.pveObj } : pveobj(),
                supportPokemon: (props.parentState.supportPokemon) ? props.parentState.supportPokemon : pveattacker(),
            }
        };
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.parentState.pveResult === prevProps.parentState.pveResult) {
            return
        }
        this.setState({
            attackerObj: (this.props.parentState.attackerObj) ? this.props.parentState.attackerObj : pveattacker(),
            bossObj: (this.props.parentState.bossObj) ? this.props.parentState.bossObj : pveobj(),
            pveObj: (this.props.parentState.pveObj) ? this.props.parentState.pveObj : pveobj(),
            supportPokemon: (this.props.parentState.supportPokemon) ? this.props.parentState.supportPokemon : pveattacker(),

            result: this.props.parentState.pveResult ? this.props.parentState.pveResult : [],
            url: this.props.parentState.url ? this.props.parentState.url : "",
            date: this.props.parentState.date ? this.props.parentState.date : 1,

            error: this.props.parentState.error,
            showResult: this.props.parentState.showResult,
            isError: this.props.parentState.isError,

            loading: false,

            snapshot: {
                attackerObj: this.props.parentState.attackerObj ? { ...this.props.parentState.attackerObj } : pveattacker(),
                bossObj: this.props.parentState.bossObj ? { ...this.props.parentState.bossObj } : pveobj(),
                pveObj: this.props.parentState.pveObj ? { ...this.props.parentState.pveObj } : pveobj(),
                supportPokemon: (this.props.parentState.supportPokemon) ? this.props.parentState.supportPokemon : pveattacker(),
            }
        });
        return
    }

    onNameChange(value, name) {
        //get movepool
        let moves = new MovePoolBuilder();
        moves.createMovePool(value, this.props.pokemonTable, optionStrings.options.moveSelect, name === "bossObj")
        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                Name: value,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,
                QuickMove: "",
                ChargeMove: "",
            },
        });
    }


    onIvChange(event, attr) {
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: String(checkIV(event.target.value)),
            },
        });
    }

    onLevelChange(event, attr) {
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: String(checkLvl(event.target.value)),
            },
        });
    }

    onTypeChange(event, attr) {
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: event.target.value,
            },
        });
    }

    onMoveAdd(value, attr, name) {
        const pool = name.includes("Charge") ? "chargeMovePool" : "quickMovePool";
        let newMovePool = [...this.state[attr][pool]]
        newMovePool.splice((newMovePool.length - 2), 0, { value: value, title: `${value}*` });

        this.setState({
            [attr]: {
                ...this.state[attr],
                showMenu: false,
                isSelected: undefined,
                [pool]: newMovePool,
                [name]: value,
            },
        });
    }

    onChange(event, atrributes, eventItem, ...other) {
        const attr = atrributes.attr;
        const name = atrributes.name;
        console.log(event.target, atrributes, eventItem, ...other)
        //check if it`s a name change
        if (eventItem && eventItem.value !== undefined) {
            switch (name) {
                case "Name":
                    this.onNameChange(eventItem.value, attr)
                    return
                default:
                    this.onMoveAdd(eventItem.value, attr, name)
                    return
            }
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

        //check if it's an iv change
        if (name === "Sta" || name === "Def" || name === "Atk") {
            this.onIvChange(event, attr)
            return
        }

        //check if it's an level change
        if (name === "Lvl") {
            this.onLevelChange(event, attr)
            return
        }

        //if it's an type change
        if (name === "IsShadow") {
            this.onTypeChange(event, attr)
            return
        }

        if (name === "SupportSlotEnabled") {
            this.onSupportEnable(event, attr)
            return
        }

        //otherwise follow general pattern
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: event.target.value
            },
        });
    }

    onSupportEnable(event, attr) {
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: this.state[attr][event.target.name] === "false" ? "true" : "false",
            },
            supportPokemon: this.state[attr][event.target.name] ? pveattacker() : this.state.supportPokemon,
        })
    }

    submitForm = async event => {
        event.preventDefault()
        //make server pvp request
        let snapshot = {
            attackerObj: { ...this.state.attackerObj },
            bossObj: { ...this.state.bossObj },
            pveObj: { ...this.state.pveObj },
            supportPokemon: { ...this.state.supportPokemon },
        }
        let url = `${encodePveAttacker(this.state.attackerObj)}/${encodePveBoss(this.state.bossObj)}/${encodePveObj(this.state.pveObj)}/${encodePveAttacker(this.state.supportPokemon)}`
        this.setState({
            loading: true,
        })


        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/common/" + url, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.props.changeUrl("/pve/common/" + url)
            this.setState({
                showResult: true,
                isError: false,
                loading: false,

                date: Date.now(),
                result: result,
                snapshot: snapshot,

                url: window.location.href,
            })
        } catch (e) {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(e),
            })
        }
    }

    onClick(event, attributes) {
        const attr = attributes.attr
        this.setState({
            [attr]: {
                ...this.state[attr],
                showMenu: false,
                isSelected: undefined,
            }
        });
    }

    render() {
        return (
            <Grid container justify="center" spacing={3}>

                <Grid item xs={12}>
                    <GreyPaper elevation={4} enablePadding>
                        <SimulatorPanel
                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            pokList={this.props.parentState.pokList}
                            boostersList={this.props.parentState.boostersList}
                            chargeMoveList={this.props.parentState.chargeMoveList}
                            quickMoveList={this.props.parentState.quickMoveList}

                            value={this.state}
                            onChange={this.onChange}
                            onClick={this.onClick}
                        />
                    </GreyPaper>
                </Grid>

                <Grid item xs={12} container justify="center">
                    <Button
                        onClick={this.submitForm}
                        title={strings.buttons.calculate}
                        endIcon={<i className="fa fa-calculator" aria-hidden="true"></i>}
                    />
                </Grid>

                {this.state.isError &&
                    <Grid item xs={12}>
                        <Alert variant="filled" severity="error">{this.state.error}</Alert >
                    </Grid>}

                {this.state.loading &&
                    <Grid item xs={12}>
                        <LinearProgress color="secondary" />
                    </ Grid>}

                {this.state.showResult && this.state.result && this.state.result.length > 0 &&
                    <Grid item xs={12}>
                        <GreyPaper elevation={4} enablePadding>
                            <PveResult
                                date={this.state.date}
                                result={this.state.result}
                                snapshot={this.state.snapshot}
                                tables={this.props.parentState.tables}
                                url={this.state.url}

                                pokemonTable={this.props.pokemonTable}
                                moveTable={this.props.parentState.moveTable}
                                pokList={this.props.parentState.pokList}
                                chargeMoveList={this.props.parentState.chargeMoveList}
                                quickMoveList={this.props.parentState.quickMoveList}
                            />
                        </GreyPaper>
                    </Grid>}
            </Grid>
        );
    }
}



export default CommonPve