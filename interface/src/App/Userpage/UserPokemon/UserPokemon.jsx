import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import SiteHelm from "../../SiteHelm/SiteHelm"
import Errors from "../../PvP/components/Errors/Errors"
import Loader from "../../PvpRating/Loader"
import AuthButton from "../../Registration/RegForm/AuthButton/AuthButton"
import PokemonPanel from "../../PvE/Components/Panels/PokemonPanel/PokemonPanel"
import PokemonBox from "./PokemonBox/PokemonBox"

import { refresh } from "../../../AppStore/Actions/refresh"
import { getPokemonBase } from "../../../AppStore/Actions/getPokemonBase"
import { getMoveBase } from "../../../AppStore/Actions/getMoveBase"
import { getCustomMoves } from "../../../AppStore/Actions/getCustomMoves"
import { getCookie } from "../../../js/getCookie"
import { userLocale } from "../../../locale/userLocale"
import { locale } from "../../../locale/locale"
import { returnMovePool, separateMovebase, pveattacker, checkLvl, checkIV, selectQuickRaids, selectChargeRaids } from "../../../js/indexFunctions"

import "./UserPokemon.scss"

let strings = new LocalizedStrings(userLocale);
let pvpStrings = new LocalizedStrings(locale);


class UserShinyBroker extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pvpStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            activePokemon: pveattacker(),

            notOk: {},

            pokList: {},
            moveTable: {},
            chargeMoveList: [],
            quickMoveList: [],

            showImport: false,
            userPokemon: [],


            loading: true,
            error: "",
            ok: false,
            submitting: false,
        }

        this.onChange = this.onChange.bind(this)
        this.onSaveChanges = this.onSaveChanges.bind(this)
        this.onPokemonAdd = this.onPokemonAdd.bind(this)
        this.onPokemonDelete = this.onPokemonDelete.bind(this)
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })

        await this.props.refresh()
        try {
            let fetches = [
                this.props.getPokemonBase(),
                this.props.getMoveBase(),
                this.props.getCustomMoves(),
                fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/getbroker", {
                    method: "GET",
                    credentials: "include",
                })
            ]

            let responses = await Promise.all(fetches)

            let userBroker = await responses[fetches.length - 1].json()

            //if response is not ok, handle error
            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (i <= 1 ? this.props.bases.error : (i === 2 ? this.props.customMoves.error : userBroker.detail)) }
            }

            let mergedMovebase = { ...this.props.customMoves.moves, ...this.props.bases.moveBase }
            let movebaseSeparated = separateMovebase(mergedMovebase)

            this.setState({
                loading: false,
                error: "",

                pokList: this.returnPokList(this.props.bases.pokemonBase),
                moveTable: mergedMovebase,
                chargeMoveList: movebaseSeparated.chargeMoveList,
                quickMoveList: movebaseSeparated.quickMoveList,
            })

        } catch (e) {
            this.setState({
                loading: false,
                error: String(e)
            })
        }
    }

    returnPokList(pokBase) {
        return Object.entries(pokBase).map((value) => ({ value: value[0], label: <div style={{ textAlign: "left" }}>{value[0]}</div>, }))
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


    onNameChange(event, name) {
        //get movepool
        switch (name) {
            case "attackerObj":
                var moves = returnMovePool(event.value, this.props.bases.pokemonBase, pvpStrings.options.moveSelect)
                break
            case "supportPokemon":
                moves = returnMovePool(event.value, this.props.bases.pokemonBase, pvpStrings.options.moveSelect)
                break
            default:
                moves = returnMovePool(event.value, this.props.bases.pokemonBase, pvpStrings.options.moveSelect, true)
        }
        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                Name: event.value,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,
                QuickMove: selectQuickRaids(moves.quickMovePool, this.state.moveTable, event.value, this.props.bases.pokemonBase),
                ChargeMove: selectChargeRaids(moves.chargeMovePool, this.state.moveTable, event.value, this.props.bases.pokemonBase),
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

    onPokemonAdd(event) {
        let attr = event.target.getAttribute("attr")
        if (this.state[attr].length > 1500) { return }
        let err = this.validate()
        if (Object.values(err).reduce((sum, val) => sum + (val === "" ? false : true), false)) {
            this.setState({
                notOk: err,
            })
            return
        }

        this.setState({
            [attr]: [...this.state.userPokemon, this.state.activePokemon],
            notOk: {},
        })
    }

    validate() {
        let errObj = {}
        if (this.state.activePokemon.Name === "") {
            errObj.Name = "Name err"
        }
        if (this.state.activePokemon.QuickMove === "") {
            errObj.Quick = "Quick Move err"
        }
        if (this.state.activePokemon.ChargeMove === "") {
            errObj.Charge = "Charge Move err"
        }
        return errObj
    }

    onPokemonDelete(event) {
        let attr = event.target.getAttribute("attr")
        let index = Number(event.target.getAttribute("index"))

        this.setState({
            [attr]: this.state.userPokemon.filter((value, key) => key !== index),
        })
    }



































    onTurnOnImport(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        let role = event.target.getAttribute("attr")
        this.setState({
            [role + "Import"]: !this.state[role + "Import"]
        });
    }

    onImport(obj) {
        this.setState({
            [obj.attr + "Import"]: !this.state[obj.attr + "Import"],
            [obj.attr]: this.createImportedList(obj.value)
        });
    }

    createImportedList(str) {
        let importedList = str.split(",")

        let idBase = {}

        // eslint-disable-next-line
        for (const [key, value] of Object.entries(this.props.bases.pokemonBase)) {
            idBase[value.Number + (value.Forme ? "-" + value.Forme : "")] = value
        }

        let importedAsObj = {}
        importedList.filter((value) => !!idBase[value]).forEach((value) => {
            importedAsObj[idBase[value].Title] = { Name: idBase[value].Title, Type: "Shiny", Amount: "1" }
        })
        return importedAsObj
    }

    async onSaveChanges() {
        console.log(this.state.activePokemon)
    }


    render() {
        return (
            <div className="col pt-2 px-2">
                <SiteHelm
                    url="https://pogpvp.com/profile/shinybroker"
                    header={strings.pageheaders.usrbroker}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                <div className="row mx-0 justify-content-center" >
                    {this.state.loading &&
                        <Loader
                            color="black"
                            weight="500"
                            locale={strings.loading}
                            loading={this.state.loading}
                        />}
                    {!this.state.loading && !this.state.error &&
                        <>
                            <div className="user-pokemon__title col-12 pt-2 text-center">{strings.userpok.poktitle}</div>
                            <div className="col-12 pt-3">
                                <PokemonPanel
                                    attr="activePokemon"
                                    canBeShadow={true}

                                    pokemonTable={this.props.bases.pokemonBase}
                                    moveTable={this.state.moveTable}


                                    pokList={this.state.pokList}
                                    chargeMoveList={this.state.chargeMoveList}
                                    quickMoveList={this.state.quickMoveList}

                                    value={this.state.activePokemon}
                                    settingsValue={this.state.settingsObj}

                                    onChange={this.onChange}

                                    onClick={this.onClick}
                                />
                            </div>
                            {Object.values(this.state.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false) &&
                                <div className="col-12 pt-2">
                                    <Errors class="alert alert-danger p-2" value={
                                        Object.values(this.state.notOk).reduce((sum, val) => {
                                            sum.push(<div className="col-12 py-1">{val}</div>)
                                            return sum
                                        }, [])
                                    }
                                    />
                                </div>}
                            <div className="col-12 pt-2">
                                <PokemonBox
                                    limit={1500}
                                    attr="userPokemon"
                                    label={strings.shbroker.have}

                                    onImport={this.onImport}
                                    onTurnOnImport={this.onTurnOnImport}
                                    showImportExportPanel={this.state.showImport}


                                    onPokemonAdd={this.onPokemonAdd}
                                    onPokemonDelete={this.onPokemonDelete}

                                    pokemonTable={this.props.bases.pokemonBase}
                                    moveTable={this.state.moveTable}
                                    userList={this.state.userPokemon}
                                />
                            </div>
                        </>}


                    {this.state.pokList && <div className="col-12 px-1">
                        <div className="row m-0 py-2 mb-2 justify-content-center">
                            <AuthButton
                                loading={this.state.submitting}
                                title={this.state.ok ? "Ok" : strings.moveconstr.changes}
                                onClick={this.onSaveChanges}
                                disabled={false}
                            />
                        </div>
                    </div>}

                    {!!this.state.error &&
                        <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                            <Errors class="alert alert-danger p-2" value={this.state.error} />
                        </div>}
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        getPokemonBase: () => dispatch(getPokemonBase()),
        getMoveBase: () => dispatch(getMoveBase()),
        getCustomMoves: () => dispatch(getCustomMoves()),
    }
}

export default connect(
    state => ({
        bases: state.bases,
        customMoves: state.customMoves,
    }), mapDispatchToProps
)(UserShinyBroker)