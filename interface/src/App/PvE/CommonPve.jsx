import React from "react";
import {
    returnMovePool, pveattacker, boss, pveobj, encodePveAttacker, encodePveBoss, encodePveObj, getCookie, checkLvl, checkIV
} from '../../js/indexFunctions.js'

import SimulatorPanel from "./Components/SimulatorPanel"
import SubmitButton from "../PvP/components/SubmitButton/SubmitButton"
import Errors from "../PvP/components/Errors/Errors"
import PveResult from "./Components/PveResult/PveResult"
import Loader from "../PvpRating/Loader"


import LocalizedStrings from 'react-localization';
import { locale } from "../../locale/locale"

let strings = new LocalizedStrings(locale);


class CommonPve extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            attackerObj: (this.props.parentState.attackerObj) ? this.props.parentState.attackerObj : pveattacker(),
            bossObj: (this.props.parentState.bossObj) ? this.props.parentState.bossObj : boss(strings.tips.nameSearch),
            pveObj: (this.props.parentState.pveObj) ? this.props.parentState.pveObj : pveobj(),

            result: this.props.parentState.pveResult ? this.props.parentState.pveResult : [],
            url: this.props.parentState.url ? this.props.parentState.url : "",
            date: this.props.parentState.date ? this.props.parentState.date : 1,

            error: this.props.parentState.error,
            showResult: this.props.parentState.showResult,
            isError: this.props.parentState.isError,

            loading: false,

            snapshot: {
                attackerObj: this.props.parentState.attackerObj ? { ...this.props.parentState.attackerObj } : pveattacker(),
                bossObj: this.props.parentState.bossObj ? { ...this.props.parentState.bossObj } : boss(strings.tips.nameSearch),
                pveObj: this.props.parentState.pveObj ? { ...this.props.parentState.pveObj } : pveobj(),
            }
        };
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.onClick = this.onClick.bind(this);
        this.assignSort = this.assignSort.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.parentState.pveResult === prevProps.parentState.pveResult) {
            return
        }

        this.setState({
            attackerObj: (this.props.parentState.attackerObj) ? this.props.parentState.attackerObj : pveattacker(),
            bossObj: (this.props.parentState.bossObj) ? this.props.parentState.bossObj : boss(strings.tips.nameSearch),
            pveObj: (this.props.parentState.pveObj) ? this.props.parentState.pveObj : pveobj(),

            result: this.props.parentState.pveResult ? this.props.parentState.pveResult : [],
            url: this.props.parentState.url ? this.props.parentState.url : "",
            date: this.props.parentState.date ? this.props.parentState.date : 1,

            error: this.props.parentState.error,
            showResult: this.props.parentState.showResult,
            isError: this.props.parentState.isError,

            loading: false,

            snapshot: {
                attackerObj: this.props.parentState.attackerObj ? { ...this.props.parentState.attackerObj } : pveattacker(),
                bossObj: this.props.parentState.bossObj ? { ...this.props.parentState.bossObj } : boss(strings.tips.nameSearch),
                pveObj: this.props.parentState.pveObj ? { ...this.props.parentState.pveObj } : pveobj(),
            }
        });
        return
    }

    onNameChange(event, name) {
        //get movepool
        switch (name) {
            case "attackerObj":
                var moves = returnMovePool(event.value, this.props.parentState.pokemonTable, strings.options.moveSelect)
                break
            default:
                moves = returnMovePool(event.value, this.props.parentState.pokemonTable, strings.options.moveSelect, true)
        }
        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                "Name": event.value,
                "quickMovePool": moves.quickMovePool,
                "chargeMovePool": moves.chargeMovePool,
                "QuickMove": "",
                "ChargeMove": "",
            },
        });
    }


    onIvChange(event) {
        let role = event.target.getAttribute("attr")
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkIV(event.target.value) + "",
            },
        });
    }

    onLevelChange(event) {
        let role = event.target.getAttribute("attr")
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: checkLvl(event.target.value) + "",
            },
        });
    }

    onTypeChange(event) {
        let role = event.target.getAttribute("attr")
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

    onChange(event, name) {
        //check if it`s a name change
        if (event.target === undefined) {
            switch (name.name[1]) {
                case "QuickMove":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    break
                case "ChargeMove":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    break
                default:
                    this.onNameChange(event, name.name[0])
                    break
            }
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
        if (event.target.value === "Select...") {
            var role = event.target.getAttribute("attr")
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
            this.onTypeChange(event)
            return
        }
        //otherwise follow general pattern
        role = event.target.getAttribute("attr")
        this.setState({
            [role]: {
                ...this.state[role],
                [event.target.name]: event.target.value
            },
            stateModified: true,
        });
    }


    submitForm = async event => {
        //make server pvp request
        let snapshot = {
            attackerObj: { ...this.state.attackerObj },
            bossObj: { ...this.state.bossObj },
            pveObj: { ...this.state.pveObj },
        }
        let url = encodePveAttacker(this.state.attackerObj) + "/" + encodePveBoss(this.state.bossObj) + "/" + encodePveObj(this.state.pveObj)
        event.preventDefault();
        this.setState({
            loading: true,
        });
        let reason = ""
        const response = await fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/request/common/" + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip',
            },
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: String(reason),
            });
            return
        }
        //parse answer
        const data = await response.json();
        //if response is not ok, handle error
        if (!response.ok) {
            if (data.detail === "PvE error") {
                this.setState({
                    showResult: false,
                    isError: true,
                    loading: false,
                    error: data.case.What,
                });
                return;
            }
            this.setState({
                showResult: false,
                isError: true,
                loading: false,
                error: data.detail,
            });
            return;
        }
        //otherwise set state
        this.props.changeUrl("/pve/common/" + url)
        this.setState({
            showResult: true,
            isError: false,
            loading: false,

            date: Date.now(),
            result: data,
            snapshot: snapshot,

            url: window.location.href,
        });
    };

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

    assignSort(data) {
        this.setState({
            result: data,
        });
    }

    render() {
        return (
            < >
                <div className="row justify-content-center m-0 mb-4 p-0"  >

                    <div className="col-12 veryBig results py-1 py-sm-2 px-0 px-sm-1 m-0" >
                        <SimulatorPanel
                            className="row justify-content-between m-0 p-0"
                            pokemonTable={this.props.parentState.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            pokList={this.props.parentState.pokList}
                            chargeMoveList={this.props.parentState.chargeMoveList}
                            quickMoveList={this.props.parentState.quickMoveList}

                            value={this.state}
                            onChange={this.onChange}
                            onClick={this.onClick}
                        />

                    </div>
                    {this.state.isError && <div className="col-12 d-flex justify-content-center p-0 m-0 mb-2 mt-3" >
                        <Errors class="alert alert-danger m-0 p-2" value={this.state.error} /></div>}
                    <div className="col-12 d-flex justify-content-center p-0 m-0 my-1" >
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

                    {(this.state.showResult) && <div className="veryBig col-12 col-md-10 col-lg-6 justify-content-center p-0 m-0" >
                        <PveResult
                            date={this.state.date}
                            result={this.state.result}
                            snapshot={this.state.snapshot}
                            tables={this.props.parentState.tables}
                            url={this.state.url}

                            assignSort={this.assignSort}

                            pokemonTable={this.props.parentState.pokemonTable}
                            moveTable={this.props.parentState.moveTable}
                            pokList={this.props.parentState.pokList}
                            chargeMoveList={this.props.parentState.chargeMoveList}
                            quickMoveList={this.props.parentState.quickMoveList}
                        />
                    </div>}
                </div>
            </ >

        );
    }
}



export default CommonPve