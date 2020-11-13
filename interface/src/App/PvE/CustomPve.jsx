import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import OopsError from "./Components/OopsError/OopsError";
import SimulatorPanel from "./Components/SimulatorPanel";
import Button from "App/Components/Button/Button";
import PveResult from "./Components/PveResult/PveResult";

import { MovePoolBuilder } from "js/movePoolBuilder";
import { pveattacker, boss, pveobj, pveUserSettings, pveCutomParty } from "js/indexFunctions";

import { getCookie } from "js/getCookie";
import { locale } from "locale/Pve/Pve";
import { navlocale } from "locale/Navbar/Navbar";
import { options } from "locale/Components/Options/locale";

let navStrings = new LocalizedStrings(navlocale);
let strings = new LocalizedStrings(locale);
let optionStrings = new LocalizedStrings(options);

class CustomPve extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        navStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
        this.state = {
            userSettings: pveUserSettings(),
            bossObj: boss(),
            pveObj: pveobj(),

            result: [],
            date: props.parentState.date ? props.parentState.date : 1,

            error: props.parentState.error,
            showResult: props.parentState.showResult,
            isError: props.parentState.isError,

            loading: false,

            snapshot: {
                userSettings: {},
                bossObj: boss(),
                pveObj: pveobj(),
            }
        };
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onClick = this.onClick.bind(this);
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


    onTypeChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value,
            },
        });
    }


    onMoveAdd(value, attr, name) {
        const pool = name.includes("Charge") ? "chargeMovePool" : "quickMovePool"
        var newMovePool = [...this.state[attr][pool]]
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

    onChangeMode(mode) {
        this.setState({
            userSettings: {
                ...this.state.userSettings,
                FindInCollection: mode === "userCollection" ? true : false,
            }
        })
    }

    onPartySelect(partyName, partyNumber, playerNumber) {
        let userPlayers = [...this.state.userSettings.UserPlayers]
        userPlayers[playerNumber][partyNumber] = this.props.userParties[partyName] ? { party: this.props.userParties[partyName], title: partyName } : pveCutomParty()

        this.setState({
            userSettings: {
                ...this.state.userSettings,
                UserPlayers: userPlayers,
            },
        })
    }

    onPlayerAdd() {
        this.setState({
            userSettings: {
                ...this.state.userSettings,
                UserPlayers: [...this.state.userSettings.UserPlayers, [pveCutomParty(), pveCutomParty(), pveCutomParty()]]
            },
        });
    }

    onPlayerDelete(event, index) {
        this.setState({
            userSettings: {
                ...this.state.userSettings,
                UserPlayers: [...this.state.userSettings.UserPlayers.slice(0, index), ...this.state.userSettings.UserPlayers.slice(index + 1)]
            },
        });
    }

    onChange(event, atrributes, eventItem, ...other) {
        const attr = atrributes.attr;
        const name = atrributes.name;
        //check if it`s a name change
        if (eventItem && eventItem.value !== undefined) {
            switch (name) {
                case "Name":
                    this.onNameChange(eventItem.value, attr)
                    return
                case "partySelect":
                    this.onPartySelect(eventItem.value, atrributes.category, attr)
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

        //if it's an type change
        if (name === "IsShadow") {
            this.onTypeChange(event, attr)
            return
        }

        if (name === "SupportSlotEnabled") {
            this.onSupportEnable(event, attr)
            return
        }

        //check if it is mode change
        if (attr === "userCollection" || attr === "userGroups") {
            this.onChangeMode(attr)
            return
        }

        if (attr === "deletePlayer") {
            this.onPlayerDelete(event, atrributes.index)
            return
        }
        if (name === "addPlayer") {
            this.onPlayerAdd()
            return
        }

        //otherwise follow general pattern
        this.setState({
            [attr]: {
                ...this.state[attr],
                [name]: event.target.value
            },
        });
    }

    onSupportEnable(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: this.state[role][event.target.name] === "false" ? "true" : "false",
            },
            supportPokemon: this.state[role][event.target.name] ? pveattacker() : this.state.supportPokemon,
        })
    }

    makeRequestObject() {
        return {
            UserPlayers: this.validatePlayers(),

            Boss: {
                Name: this.state.bossObj.Name, QuickMove: this.state.bossObj.QuickMove,
                ChargeMove: this.state.bossObj.ChargeMove, Tier: Number(this.state.bossObj.Tier)
            },
            AggresiveMode: this.state.pveObj.IsAggresive === "true",

            DodgeStrategy: Number(this.state.pveObj.DodgeStrategy),
            Weather: Number(this.state.pveObj.Weather),
            FriendStage: Number(this.state.pveObj.FriendshipStage),
            PartySize: Number(this.state.pveObj.PartySize),

            BoostSlotEnabled: this.state.pveObj.SupportSlotEnabled !== "false",
            FindInCollection: this.state.userSettings.FindInCollection,
            SortByDamage: this.state.userSettings.SortByDamage === "true",
        }
    }

    validatePlayers() {
        switch (this.state.userSettings.FindInCollection) {
            case true:
                var userPlayers = []
                break
            default:
                userPlayers = []
                //for every player
                this.state.userSettings.UserPlayers.forEach((playerGroups, playerNumber) => {
                    //skip empty players
                    if (!playerGroups || playerGroups.length === 0) { return }
                    let mergedGroups = []
                    //for every player group
                    playerGroups.forEach((group, groupNumber) => {
                        //skip empty groups
                        if (!group || !group.party || group.length === 0) { return }
                        //save non empty groups
                        mergedGroups = [...mergedGroups, ...group.party]
                    })
                    //add player to players list
                    userPlayers.push(mergedGroups)
                })
        }
        return userPlayers
    }

    submitForm = async event => {
        event.preventDefault()
        //make server pvp request
        let snapshot = {
            attackerObj: { ...this.state.userSettings },
            bossObj: { ...this.state.bossObj },
            pveObj: { ...this.state.pveObj },
        }

        this.setState({
            loading: true,
        })

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/custom/", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
                body: JSON.stringify(this.makeRequestObject()),
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.setState({
                showResult: true,
                isError: false,
                loading: false,

                date: Date.now(),
                result: result,
                snapshot: snapshot,
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
        this.setState({
            [attributes.attr]: {
                ...this.state[attributes.attr],
                showMenu: false,
                isSelected: undefined,
            }
        });
    }

    render() {
        return (
            <Grid container justify="center" spacing={3}>

                {!!getCookie("sid") &&
                    <>
                        <Grid item xs={12}>
                            <GreyPaper elevation={4} enablePadding>
                                <SimulatorPanel
                                    forCustomPve={true}

                                    pokemonTable={this.props.pokemonTable}
                                    moveTable={this.props.parentState.moveTable}
                                    pokList={this.props.parentState.pokList}
                                    chargeMoveList={this.props.parentState.chargeMoveList}
                                    quickMoveList={this.props.parentState.quickMoveList}

                                    userParties={this.props.userParties}
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

                        {this.state.result && this.state.showResult && this.state.result.length > 0 &&
                            <Grid item xs={12}>
                                <GreyPaper elevation={4} enablePadding>
                                    <PveResult
                                        customResult={true}
                                        needsAvg={!this.state.snapshot.attackerObj.FindInCollection && this.state.snapshot.attackerObj.UserPlayers.length > 1}

                                        date={this.state.date}
                                        result={this.state.result}
                                        snapshot={this.state.snapshot}
                                        tables={this.props.parentState.tables}

                                        pokemonTable={this.props.pokemonTable}
                                        moveTable={this.props.parentState.moveTable}
                                        pokList={this.props.parentState.pokList}
                                        boostersList={this.props.parentState.boostersList}
                                        chargeMoveList={this.props.parentState.chargeMoveList}
                                        quickMoveList={this.props.parentState.quickMoveList}
                                    />
                                </GreyPaper>
                            </Grid>}
                    </>}

                {!getCookie("sid") &&
                    <Grid item xs={12}>
                        <OopsError
                            description={strings.oopsReg}
                            link={"/registration"}
                            linkTitle={navStrings.navbar.sup}
                        />
                    </Grid>}

            </Grid>
        );
    }
}

export default CustomPve;

CustomPve.propTypes = {
    pokemonTable: PropTypes.object,

    changeUrl: PropTypes.func,
    parentState: PropTypes.object,
    userParties: PropTypes.object,
};