import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import EditMenu from "./EditMenu/EditMenu"
import MagicBox from "../../PvP/components/MagicBox/MagicBox"
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
import { returnMovePool, separateMovebase, getUserPok, checkLvl, checkIV, selectQuickRaids, selectChargeRaids, calculateCP } from "../../../js/indexFunctions"

import "./UserPokemon.scss"

let strings = new LocalizedStrings(userLocale);
let pvpStrings = new LocalizedStrings(locale);


class UserShinyBroker extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pvpStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            activePokemon: getUserPok(),
            editPokemon: {},
            showEdit: false,

            notOk: {},
            editNotOk: {},

            pokList: {},
            moveTable: {},
            chargeMoveList: [],
            quickMoveList: [],

            showImport: false,
            userPokemon: [
                { Name: "Abra", QuickMove: "Psycho Cut", ChargeMove: "Psyshock", Lvl: "40", Atk: "15", Def: "15", Sta: "15", IsShadow: "false", },
                { Name: "Absol", QuickMove: "Snarl", ChargeMove: "Dark Pulse", Lvl: "40", Atk: "15", Def: "15", Sta: "15", IsShadow: "true", },
                { Name: "Mega Charizard X", QuickMove: "Fire Spin", ChargeMove: "Blast Burn", Lvl: "40", Atk: "15", Def: "15", Sta: "15", IsShadow: "false", },
            ],


            loading: true,
            error: "",
            ok: false,
            submitting: false,
        }

        this.onChange = this.onChange.bind(this)
        this.onMenuClose = this.onMenuClose.bind(this)
        this.onSaveChanges = this.onSaveChanges.bind(this)

        this.onPokemonAdd = this.onPokemonAdd.bind(this)
        this.onPokemonDelete = this.onPokemonDelete.bind(this)
        this.onPokemonEdit = this.onPokemonEdit.bind(this)
        this.onPokemonEditSubmit = this.onPokemonEditSubmit.bind(this)

        this.onCloseOuterMenu = this.onCloseOuterMenu.bind(this)

        this.onTurnOnImport = this.onTurnOnImport.bind(this)
        this.onImport = this.onImport.bind(this)
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

    onMenuClose(event) {
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
                ChargeMove2: "",
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
        let err = this.validate(this.state.activePokemon)
        if (Object.values(err).reduce((sum, val) => sum + (val === "" ? false : true), false)) {
            this.setState({
                notOk: err,
            })
            return
        }

        let newPok = { ...this.state.activePokemon }
        newPok.CP = calculateCP(newPok.Name, newPok.Lvl, newPok.Atk, newPok.Def, newPok.Sta, this.props.bases.pokemonBase)

        this.setState({
            [attr]: [...this.state.userPokemon, newPok],
            notOk: {},
        })
    }

    validate(obj) {
        let errObj = {}
        if (obj.Name === "") {
            errObj.Name = strings.userpok.err.errname
        }
        if (obj.QuickMove === "") {
            errObj.Quick = strings.userpok.err.errq
        }
        if (obj.ChargeMove === "") {
            errObj.Charge = strings.userpok.err.errch
        }
        return errObj
    }

    onPokemonDelete(event) {
        let attr = event.target.getAttribute("attr")
        let index = Number(event.target.getAttribute("index"))

        this.setState({
            [attr]: [...this.state.userPokemon.slice(0, index), ...this.state.userPokemon.slice(index + 1)],
        })
    }















    onPokemonEdit(pok) {
        //get movepool
        var moves = returnMovePool(pok.Name, this.props.bases.pokemonBase, pvpStrings.options.moveSelect)

        this.setState({
            showEdit: true,
            editPokemon: {
                ...pok,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,
            },
        })

    }

    onPokemonEditSubmit() {
        let err = this.validate(this.state.editPokemon)
        if (Object.values(err).reduce((sum, val) => sum + (val === "" ? false : true), false)) {
            this.setState({
                editNotOk: err,
            })
            return
        }
        let newList = [...this.state.userPokemon]
        newList[this.state.editPokemon.index] = this.state.editPokemon
        this.setState({
            showEdit: false,
            userPokemon: newList,
            editNotOk: {},
            editPokemon: {},
        })
    }

    onCloseOuterMenu(event) {
        let role = event.target.getAttribute("attr")
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        this.setState({
            [role]: !this.state[role],
        })
    }













    onTurnOnImport(event) {
        if (!(event.target === event.currentTarget) && event.target.getAttribute("name") !== "closeButton") {
            return
        }
        this.setState({
            showImport: !this.state.showImport
        });
    }

    onImport(obj) {
        this.setState({
            showImport: !this.state.showImport,
            userPokemon: obj.type === "string" ? this.parseString(obj.value) : this.parseScv(obj.value.slice(1, obj.value.length), obj.value[0])
        });
    }

    findRow(target, arr, defaultIndex) {
        let index = arr.findIndex((value) => value === target)
        return index === -1 ? defaultIndex : index
    }

    parseScv(scv, firstRow) {
        const nameIndex = this.findRow("Name", firstRow, 3),
            lvlIndex = this.findRow("Level", firstRow, 6),
            atkIndex = this.findRow("ØATT IV", firstRow, 14),
            defIndex = this.findRow("ØDEF IV", firstRow, 15),
            staIndex = this.findRow("ØHP IV", firstRow, 16),
            quickIndex = this.findRow("Fast move", firstRow, 18),
            chargeIndex = this.findRow("Special move", firstRow, 19),
            charge2Index = this.findRow("Special move 2", firstRow, 20),
            isShadowIndex = this.findRow("ShadowForm", firstRow, 30);



        let importedArr = []
        if (scv.length <= 1) { return importedArr }
        scv.forEach((value) => {
            if (value.length < 31) { return }
            //parse name
            let Name = this.translateName(value[nameIndex])

            if (!this.props.bases.pokemonBase[Name]) {
                console.log(`Critical: "${Name}" not found in the database`)
                return
            }

            //parse type
            let IsShadow = value[isShadowIndex] === "1" ? "true" : "false"

            //check moves
            let QuickMove = this.translareMove(value[quickIndex])

            if (!this.state.moveTable[QuickMove]) {
                console.log(`Critical: "Quick move "${QuickMove}" of ${Name} not found in the database`)
                return
            }

            let ChargeMove = this.translareMove(value[chargeIndex])


            if (!this.state.moveTable[ChargeMove]) {
                console.log(`Critical: "First charge move "${ChargeMove}" of ${Name} not found in the database`)
                return
            }

            let ChargeMove2 = this.translareMove(value[charge2Index])

            if (!!ChargeMove2 && !this.state.moveTable[ChargeMove2]) {
                console.log(`Critical: "Second charge move "${ChargeMove2}" of ${Name} not found in the database`)
                return
            }
            if (!ChargeMove2) { ChargeMove2 = "" }
            //get stats
            let Lvl = checkLvl(value[lvlIndex])
            let Atk = checkIV(value[atkIndex])
            let Def = checkIV(value[defIndex])
            let Sta = checkIV(value[staIndex])
            //calculate cp
            let CP = calculateCP(Name, Lvl, Atk, Def, Sta, this.props.bases.pokemonBase)

            importedArr.push({ Name, IsShadow, QuickMove, ChargeMove, ChargeMove2, Lvl, Atk, Def, Sta, CP })
        })
        if (importedArr.length > 1500) { importedArr.clice(0, 1500) }
        return importedArr
    }

    translateName(name) {
        //prohibited symbols
        name = name.replace(/\.$/, "")
        name = name.replace("'", "")

        name = this.deleteSuffix(name, [" Normal", " Shadow", " Purified", " Standard"])
        name = this.moveSuffixToPrefix(name, [" Alolan", " Galarian"])
        name = this.makeNewSuffix(name, " (", " Forme)", [" Altered", " Origin", " Attack", " Defence", " Speed", " Normal", " Incarnate"])

        name = this.makeNewSuffix(name, " (", " Cloak)", [" Plant", " Trash", " Sandy"])
        name = this.makeNewSuffix(name, " (", " Form)", [" Overcast", " Sunshine"])
        name = this.makeNewSuffix(name, " (", ")", [" Sunny", " Rainy", " Snowy"])

        name = this.checkNameInDict(name)

        return name
    }

    checkNameInDict(str) {
        let dict = {
            Deoxys: "Deoxys (Normal Forme)",
        }
        if (!!dict[str]) {
            return dict[str]
        }
        return str
    }

    deleteSuffix(str, arrOfTargets) {
        for (let i = 0; i < arrOfTargets.length; i++) {
            let index = str.indexOf(arrOfTargets[i])
            if (index !== -1) {
                return str.slice(0, index)
            }
        }
        return str
    }

    moveSuffixToPrefix(str, arrOfTargets) {
        for (let i = 0; i < arrOfTargets.length; i++) {
            let index = str.indexOf(arrOfTargets[i])
            if (index !== -1) {
                str = str.slice(0, index)
                return `${arrOfTargets[i].slice(1)} ${str}`
            }
        }
        return str
    }

    makeNewSuffix(str, suffixStart, suffixEnd, arrOfTargets) {
        for (let i = 0; i < arrOfTargets.length; i++) {
            let index = str.indexOf(arrOfTargets[i])
            if (index !== -1) {
                str = str.slice(0, index)
                str = `${str}${suffixStart}${arrOfTargets[i].slice(1)}${suffixEnd}`
                break
            }
        }
        return str
    }

    translareMove(moveName) {
        let dictMove = {
            "Mud-Slap": "Mud Slap",
            "Super Power": "Superpower"
        }

        if (!!dictMove[moveName]) {
            return dictMove[moveName]
        }
        if (moveName === " - " || moveName === "-" || moveName === "- ") {
            return ""
        }
        return moveName
    }

    parseString(str) {
        let importedList = str.split("\n")

        let importedArr = []
        importedList.forEach((value) => {
            //get next entry
            let pokEntry = value.split(",")
            if (pokEntry.length !== 8) { return }

            //parse name
            let nameAndType = pokEntry[0].split("!")

            let Name = nameAndType[0]
            if (!this.props.bases.pokemonBase[Name]) { return }

            //parse type
            let IsShadow = "false"
            if (nameAndType.length > 1) { IsShadow = "true" }

            //check moves
            let QuickMove = pokEntry[1]
            if (!this.state.moveTable[QuickMove]) { return }

            let ChargeMove = pokEntry[2]
            if (!this.state.moveTable[ChargeMove]) { return }

            let ChargeMove2 = pokEntry[3]
            if (!!ChargeMove2 && !this.state.moveTable[ChargeMove]) { return }
            if (!ChargeMove2) { ChargeMove2 = "" }
            //get stats
            let Lvl = checkLvl(pokEntry[4])
            let Atk = checkIV(pokEntry[5])
            let Def = checkIV(pokEntry[6])
            let Sta = checkIV(pokEntry[7])
            //calculate cp
            let CP = calculateCP(Name, Lvl, Atk, Def, Sta, this.props.bases.pokemonBase)

            importedArr.push({ Name, IsShadow, QuickMove, ChargeMove, ChargeMove2, Lvl, Atk, Def, Sta, CP })
        })
        return importedArr
    }


































    async onSaveChanges() {
    }


    render() {
        return (
            <div className="col pt-2 px-2">
                <SiteHelm
                    url="https://pogpvp.com/profile/pokemon"
                    header={strings.pageheaders.usrpok}
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

                    {(this.state.showEdit) && <MagicBox
                        onClick={this.onCloseOuterMenu}
                        attr={"showEdit"}
                        element={
                            <EditMenu
                                attr="editPokemon"

                                pokemonTable={this.props.bases.pokemonBase}
                                moveTable={this.state.moveTable}

                                pokList={this.state.pokList}
                                chargeMoveList={this.state.chargeMoveList}
                                quickMoveList={this.state.quickMoveList}

                                editPokemon={this.state.editPokemon}
                                editNotOk={this.state.editNotOk}

                                onChange={this.onChange}
                                onMenuClose={this.onMenuClose}


                                onPokemonEditSubmit={this.onPokemonEditSubmit}

                            />}

                    />}

                    {!this.state.loading && !this.state.error &&
                        <>
                            <div className="col-12 pt-2 text-center">
                                <div className="user-pokemon__title col-12 px-0 mb-4">{strings.userpok.poktitle}</div>
                            </div>
                            <div className="col-12">
                                <PokemonPanel
                                    attr="activePokemon"
                                    canBeShadow={true}

                                    pokemonTable={this.props.bases.pokemonBase}
                                    moveTable={this.state.moveTable}

                                    hasSecondCharge={true}

                                    pokList={this.state.pokList}
                                    chargeMoveList={this.state.chargeMoveList}
                                    quickMoveList={this.state.quickMoveList}

                                    value={this.state.activePokemon}

                                    onChange={this.onChange}

                                    onClick={this.onMenuClose}
                                />
                            </div>
                            {Object.values(this.state.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false) &&
                                <div className="col-12 pt-2">
                                    <Errors class="alert alert-danger p-2" value={
                                        Object.values(this.state.notOk).reduce((sum, val, index) => {
                                            sum.push(<div key={index} className="col-12 py-1">{val}</div>)
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
                                    onPokemonEdit={this.onPokemonEdit}

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