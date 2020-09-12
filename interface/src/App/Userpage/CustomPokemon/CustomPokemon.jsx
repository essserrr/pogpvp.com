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
import PartyBox from "./PartyBox/PartyBox"

import { refresh } from "../../../AppStore/Actions/refresh"
import { setCustomPokemon } from "../../../AppStore/Actions/actions"
import { getCustomPokemon } from "../../../AppStore/Actions/getCustomPokemon"
import { getPokemonBase } from "../../../AppStore/Actions/getPokemonBase"
import { getMoveBase } from "../../../AppStore/Actions/getMoveBase"
import { getCustomMoves } from "../../../AppStore/Actions/getCustomMoves"
import { getCookie } from "../../../js/getCookie"
import { userLocale } from "../../../locale/userLocale"
import { locale } from "../../../locale/locale"
import { returnMovePool, separateMovebase, getUserPok, checkLvl, checkIV, selectQuickRaids, selectChargeRaids, calculateCP } from "../../../js/indexFunctions"
import { translareMove, translateName } from "./translator"

import "./CustomPokemon.scss"

let strings = new LocalizedStrings(userLocale);
let pvpStrings = new LocalizedStrings(locale);


class CustomPokemon extends React.PureComponent {
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
            userPokemon: [],
            userParties: {},


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

        this.onGroupAdd = this.onGroupAdd.bind(this)
        this.onGroupDelete = this.onGroupDelete.bind(this)
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
                this.props.getCustomPokemon(),
            ]

            let responses = await Promise.all(fetches)
            //if response is not ok, handle error
            for (let i = 0; i < responses.length; i++) {
                if (!responses[i].ok) { throw (responses[i].detail) }
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

                userPokemon: this.props.customPokemon ? this.props.customPokemon : [],
                userParties: this.props.customParties ? this.props.customParties : {},
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
                    return
                case "ChargeMove":
                    this.onMoveAdd(event.value, name.name[0], name.name[1])
                    return
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
        if (this.state[attr].length >= 1500) { return }
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
            [attr]: this.state.userPokemon.filter((val, key) => index !== key),
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


    makeGoverningObject(header, toFind, defaults) {
        const objectFields = ["nameIndex", "lvlIndex", "atkIndex", "defIndex", "staIndex", "quickIndex", "chargeIndex", "charge2Index", "isShadowIndex"]
        let governingObj = {}
        for (let i = 0; i < objectFields.length; i++) {
            governingObj[objectFields[i]] = this.findCol(toFind[i], defaults[i], header)
        }
        return governingObj
    }

    findCol(toFind, defaults, insideArr) {
        let index = insideArr.findIndex((value) => value === toFind)
        return index === -1 ? defaults : index
    }


    parseScv(scv, firstRow) {
        switch (true) {
            case (firstRow.length < 17):
                //battler
                var governingObj = this.makeGoverningObject(firstRow,
                    ["pokemon", "level", "individualAttack", "individualDefence", "individualStamina", "quickMove", "cinematicMove", "cinematicMove1", "ShadowForm"],
                    [2, 5, 6, 7, 8, 9, 10, 13, 0])

                break
            case (firstRow.length < 38):
                //calcy
                governingObj = this.makeGoverningObject(firstRow,
                    ["Name", "Level", "ØATT IV", "ØDEF IV", "ØHP IV", "Fast move", "Special move", "Special move 2", "ShadowForm"],
                    [3, 6, 14, 15, 16, 18, 19, 20, 30])
                break
            default:
                return []
        }
        governingObj.rowLength = firstRow.length


        let importedArr = []
        if (scv.length <= 1) { return importedArr }
        scv.forEach((value) => {
            if (value.length < governingObj.rowLength) { return }
            //parse name
            let Name = translateName(value[governingObj.nameIndex])

            if (!this.props.bases.pokemonBase[Name]) {
                console.log(`Critical: "${Name}" not found in the database`)
                return
            }

            //parse type
            switch (firstRow.length < 17) {
                case true:
                    var IsShadow = value[governingObj.isShadowIndex] === "1" ? "true" : "false"
                    break
                default:
                    IsShadow = "false"
            }

            //check moves
            let QuickMove = translareMove(value[governingObj.quickIndex])

            if (!this.state.moveTable[QuickMove]) {
                console.log(`Critical: "Quick move "${QuickMove}" of ${Name} not found in the database`)
                return
            }

            let ChargeMove = translareMove(value[governingObj.chargeIndex])


            if (!this.state.moveTable[ChargeMove]) {
                console.log(`Critical: "First charge move "${ChargeMove}" of ${Name} not found in the database`)
                return
            }

            let ChargeMove2 = translareMove(value[governingObj.charge2Index])

            if (!!ChargeMove2 && !this.state.moveTable[ChargeMove2]) {
                console.log(`Critical: "Second charge move "${ChargeMove2}" of ${Name} not found in the database`)
                return
            }
            if (!ChargeMove2) { ChargeMove2 = "" }
            //get stats
            let Lvl = checkLvl(value[governingObj.lvlIndex])
            let Atk = checkIV(value[governingObj.atkIndex])
            let Def = checkIV(value[governingObj.defIndex])
            let Sta = checkIV(value[governingObj.staIndex])
            //calculate cp
            let CP = calculateCP(Name, Lvl, Atk, Def, Sta, this.props.bases.pokemonBase)

            importedArr.push({ Name, IsShadow, QuickMove, ChargeMove, ChargeMove2, Lvl, Atk, Def, Sta, CP })
        })
        if (importedArr.length > 1500) { importedArr.slice(0, 1500) }
        return importedArr
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
        this.setState({
            submitting: true, error: "", ok: false,
        })
        try {
            await this.props.refresh()
            const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/setpokemon", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ Pokemon: this.formatPokemonList(this.state.userPokemon), Parties: this.formatParties(this.state.userParties) })
            })
            //parse answer
            const data = await response.json();
            //if response is not ok, handle error
            if (!response.ok) { throw data.detail }
            //set global movelist
            this.props.setCustomPokemon({ Pokemon: this.state.userPokemon, Parties: this.state.userParties })
            //show ok
            this.setState({ submitting: false, ok: true, })
            await new Promise(res => setTimeout(res, 2500));
            this.setState({ ok: false })
        } catch (e) {
            this.setState({
                submitting: false,
                error: String(e),
            });
        }
    }

    formatParties(parties) {
        let formattedParties = {}
        Object.entries(parties).forEach((value) => {
            formattedParties[value[0]] = this.formatPokemonList(value[1])
        })
        return formattedParties
    }

    formatPokemonList(list) {
        return list.map((value) => ({
            Name: String(value.Name), IsShadow: String(value.IsShadow),
            QuickMove: String(value.QuickMove), ChargeMove: String(value.ChargeMove), ChargeMove2: String(value.ChargeMove2),
            Lvl: Number(value.Lvl), Atk: Number(value.Atk), Def: Number(value.Def), Sta: Number(value.Sta), CP: Number(value.CP)
        }))
    }


    onGroupAdd(party, key) {
        this.setState({
            userParties: { ...this.state.userParties, [key]: party, },
        })
    }

    onGroupDelete(key) {
        let newParties = { ...this.state.userParties }
        delete newParties[key]
        this.setState({
            userParties: newParties,
        })
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
                            <div className="col-12 pt-2 text-center">
                                <div className="user-pokemon__title col-12 px-0 mt-2 mb-4">{strings.userpok.grouptitle}</div>
                            </div>
                            <div className="col-12">
                                <PartyBox
                                    limit={24}
                                    attr="userParties"

                                    pokemonTable={this.props.bases.pokemonBase}
                                    moveTable={this.state.moveTable}

                                    userPokemon={this.state.userPokemon}
                                    userParties={this.state.userParties}

                                    onGroupAdd={this.onGroupAdd}
                                    onGroupDelete={this.onGroupDelete}
                                />
                            </div>
                        </>}



                    {!this.state.error && this.state.userPokemon && <div className="col-12 px-1">
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
        getCustomPokemon: () => dispatch(getCustomPokemon()),
        setCustomPokemon: obj => dispatch(setCustomPokemon(obj)),
    }
}

export default connect(
    state => ({
        bases: state.bases,
        customMoves: state.customMoves,
        customPokemon: state.customPokemon.pokemon,
        customParties: state.customPokemon.parties,
    }), mapDispatchToProps
)(CustomPokemon)