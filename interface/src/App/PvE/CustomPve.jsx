import React from "react";
import { returnMovePool, pveattacker, boss, pveobj, checkLvl, checkIV, pveUserSettings, pveCutomParty } from "../../js/indexFunctions.js"
import { getCookie } from "../../js/getCookie"

import OopsError from "./Components/OopsError/OopsError"
import SimulatorPanel from "./Components/SimulatorPanel"
import SubmitButton from "../PvP/components/SubmitButton/SubmitButton"
import Errors from "../PvP/components/Errors/Errors"
import PveResult from "./Components/PveResult/PveResult"
import Loader from "../PvpRating/Loader"


import LocalizedStrings from "react-localization"
import { locale } from "../../locale/locale"

let strings = new LocalizedStrings(locale);


class CustomPve extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            userSettings: pveUserSettings(),
            bossObj: boss(strings.tips.nameSearch),
            pveObj: pveobj(),

            result: [],
            date: this.props.parentState.date ? this.props.parentState.date : 1,

            error: this.props.parentState.error,
            showResult: this.props.parentState.showResult,
            isError: this.props.parentState.isError,

            loading: false,

            snapshot: {
                userSettings: {},
                bossObj: boss(strings.tips.nameSearch), pveObj: pveobj(),
            }
        };
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onClick = this.onClick.bind(this);
        this.replaceOriginal = this.replaceOriginal.bind(this);
    }

    onNameChange(event, name) {
        //get movepool
        switch (name) {
            default:
                var moves = returnMovePool(event.value, this.props.parentState.pokemonTable, strings.options.moveSelect, true)
        }
        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                Name: event.value,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,
                QuickMove: "",
                ChargeMove: "",
            },
        });
    }


    onIvChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkIV(event.target.value) + "",
            },
        });
    }

    onLevelChange(event, role) {
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkLvl(event.target.value) + "",
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
                });
                break
        }
    }

    onChangeMode(mode) {
        this.setState({
            userSettings: {
                ...this.state.userSettings,
                FindInCollection: mode === "userCollection" ? true : false,
            }
        })
    }

    onPartySelect(partyName, playerNumber, partyNumber) {
        let userPlayers = [...this.state.userSettings.UserPlayers]
        userPlayers[playerNumber][partyNumber] = this.props.userParties[partyName] ? { party: this.props.userParties[partyName], title: partyName } : pveCutomParty()

        this.setState({
            userSettings: {
                ...this.state.userSettings,
                UserPlayers: userPlayers,
            },
        })
    }

    onChange(event, name) {
        //check if it`s a name change
        if (event.target === undefined) {
            switch (name.name[1]) {
                case "QuickMove":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    return
                case "ChargeMove":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    return
                case "partySelect": {
                    this.onPartySelect(event.value, name.name[0].playerNumber, name.name[0].partyNumber)
                    return
                }
                default:
                    this.onNameChange(event, name.name[0])
                    return
            }
        }
        let role = event.target.getAttribute("attr")
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
        //check if it is mode change
        if (role === "userCollection" || role === "userGroups") {
            this.onChangeMode(role)
            return
        }
        //if it's an type change
        if (event.target.name === "IsShadow") {
            this.onTypeChange(event, role)
            return
        }
        if (event.target.name === "SupportSlotEnabled") {
            this.onSupportEnable(event, role)
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

    onClick(event) {
        let role = event.target.getAttribute("attr")
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
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

    replaceOriginal(data, i) {
        let newRes = [...this.state.result]
        newRes[i] = data[0]
        this.setState({
            result: newRes,
        })
    }

    render() {
        return (
            < >
                {!!getCookie("sid") && <div className="row justify-content-center m-0 mb-4"  >
                    <div className="col-12 col-md-10 col-lg-6 max1000 results py-1 py-sm-2 px-0 px-sm-1" >
                        <SimulatorPanel
                            forCustomPve={true}

                            pokemonTable={this.props.parentState.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            pokList={this.props.parentState.pokList}
                            chargeMoveList={this.props.parentState.chargeMoveList}
                            quickMoveList={this.props.parentState.quickMoveList}

                            userParties={this.props.userParties}
                            value={this.state}
                            onChange={this.onChange}
                            onClick={this.onClick}
                        />

                    </div>
                    {this.state.isError && <div className="col-12 d-flex justify-content-center p-0 mb-2 mt-3" >
                        <Errors class="alert alert-danger p-2" value={this.state.error} /></div>}
                    <div className="col-12 d-flex justify-content-center p-0 my-1" >
                        <SubmitButton
                            label={strings.buttons.calculate}
                            action="Calculate"
                            onSubmit={this.submitForm}
                            class="btn btn-primary"
                        />
                    </div>

                    {this.state.loading &&
                        <div className="col-12 mt-2 mb-3">
                            <Loader
                                color="white"
                                weight="500"
                                locale={strings.tips.loading}
                                loading={this.state.loading}
                            />
                        </div>}

                    {this.state.result && this.state.showResult && this.state.result.length > 0 &&
                        <div className="max1000 col-12 col-md-10 col-lg-6 justify-content-center p-0" >
                            <PveResult
                                customResult={true}

                                date={this.state.date}
                                result={this.state.result}
                                snapshot={this.state.snapshot}
                                tables={this.props.parentState.tables}
                                url={this.state.url}

                                replaceOriginal={this.replaceOriginal}

                                pokemonTable={this.props.parentState.pokemonTable}
                                moveTable={this.props.parentState.moveTable}
                                pokList={this.props.parentState.pokList}
                                boostersList={this.props.parentState.boostersList}
                                chargeMoveList={this.props.parentState.chargeMoveList}
                                quickMoveList={this.props.parentState.quickMoveList}
                            />
                        </div>}
                </div>}

                {!getCookie("sid") &&
                    <OopsError
                        description={strings.oopsReg}
                        link={"/registration"}
                        linkTitle={strings.navbar.sup}
                    />}
            </ >

        );
    }
}



export default CustomPve