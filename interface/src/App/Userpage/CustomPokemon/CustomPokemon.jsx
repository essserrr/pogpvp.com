import React from "react"
import LocalizedStrings from "react-localization"
import { connect } from "react-redux"

import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import SaveIcon from '@material-ui/icons/Save';

import UserPageContent from "App/Userpage/UserPageContent/UserPageContent";
import EditMenu from "./EditMenu/EditMenu"
import MagicBox from "App/PvP/components/MagicBox/MagicBox"
import SiteHelm from "App/SiteHelm/SiteHelm"
import Button from "App/Components/Button/Button"
import PokemonPanel from "App/PvE/Components/Panels/PokemonPanel/PokemonPanel"
import PokemonBox from "./PokemonBox/PokemonBox"
import PartyBox from "./PartyBox/PartyBox"

import { refresh } from "AppStore/Actions/refresh";
import { setCustomPokemon } from "AppStore/Actions/actions";
import { getCustomPokemon } from "AppStore/Actions/getCustomPokemon";
import { getPokemonBase } from "AppStore/Actions/getPokemonBase";
import { getMoveBase } from "AppStore/Actions/getMoveBase";
import { getCustomMoves } from "AppStore/Actions/getCustomMoves";
import { getCookie } from "js/getCookie";
import { MovePoolBuilder } from "js/movePoolBuilder";
import { separateMovebase } from "js/separateMovebase";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";

import { getUserPok } from "js/defaultObjects/getUserPok";
import { calculateCP } from "js/cp/calculateCP";
import { checkLvl } from "js/checks/checkLvl";
import { checkIV } from "js/checks/checkIV";
import { selectQuickRaids } from "js/MoveSelector/selectQuickRaids";
import { selectChargeRaids } from "js/MoveSelector/selectChargeRaids";
import { translareMove, translateName } from "./translator";

let strings = new LocalizedStrings(userLocale);

class CustomPokemon extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            activePokemon: getUserPok(),
            activePokemonNotOk: {},

            editPokemon: {},
            editPokemonNotOk: {},

            showEdit: false,

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
        return Object.entries(pokBase).map((value) => ({ value: value[0], title: value[0], }))
    }

    onCloseOuterMenu(event, attributes) {
        let attr = attributes.attr
        this.setState({
            [attr]: !this.state[attr],
        })
    }

    onMenuClose(event, attributes) {
        let attr = attributes.attr
        this.setState({
            [attr]: {
                ...this.state[attr],
                showMenu: false,
                isSelected: undefined,
            }
        });
    }


    onNameChange(value, name) {
        //get movepool
        var moves = new MovePoolBuilder();
        moves.createMovePool(value, this.props.bases.pokemonBase, strings.moveSelect)
        const quickMove = selectQuickRaids(moves.quickMovePool, this.state.moveTable, value, this.props.bases.pokemonBase)
        const chargeMove = selectChargeRaids(moves.chargeMovePool, this.state.moveTable, value, this.props.bases.pokemonBase)
        //set state
        this.setState({
            [name]: {
                ...this.state[name],
                Name: value,
                quickMovePool: moves.quickMovePool,
                chargeMovePool: moves.chargeMovePool,
                QuickMove: quickMove,
                ChargeMove: chargeMove,
                ChargeMove2: "",
            },
            [`${name}NotOk`]: {
                ...this.state[`${name}NotOk`],
                Name: this.check(value, "Name"),
                QuickMove: this.check(quickMove, "QuickMove"),
                ChargeMove: this.check(chargeMove, "ChargeMove"),
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

    onMoveAdd(value, attr, name) {
        const pool = name.includes("Charge") ? "chargeMovePool" : "quickMovePool";
        let newMovePool = [...this.state[attr][pool]];

        if (!newMovePool.some(e => e.value === value)) {
            newMovePool.splice((newMovePool.length - 2), 0, { value: value, title: `${value}*` });
        }

        const selectedObject = {
            ...this.state[attr],
            showMenu: false,
            isSelected: undefined,
            [pool]: newMovePool,
            [name]: value,
        }

        this.setState({
            [attr]: selectedObject,
            [`${attr}NotOk`]: {
                ...this.state[`${attr}NotOk`],
                [name]: this.check(value, name),
                ChargeMove: selectedObject.ChargeMove === "" && selectedObject.ChargeMove2 === "" ?
                    this.check(value, "ChargeMove") : "",
            },
        });
    }

    onChargeChange(event, attr) {
        const selectedObject = {
            ...this.state[attr],
            [event.target.name]: event.target.value
        }
        this.setState({
            [attr]: selectedObject,
            [`${attr}NotOk`]: {
                ...this.state[`${attr}NotOk`],
                ChargeMove: selectedObject.ChargeMove === "" && selectedObject.ChargeMove2 === "" ?
                    this.check(event.target.value, "ChargeMove") : "",
            },
        });
    }


    onChange(event, atrributes, eventItem, ...other) {
        const attr = atrributes.attr
        const name = atrributes.name
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
                }
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

        if (name === "ChargeMove" || name === "ChargeMove2") {
            this.onChargeChange(event, attr)
            return
        }
        //otherwise follow general pattern
        this.setState({
            [attr]: {
                ...this.state[attr],
                [name]: event.target.value
            },
            [`${attr}NotOk`]: {
                ...this.state[`${attr}NotOk`],
                [name]: this.check(event.target.value, name),
            },
        });
    }

    onPokemonAdd(event) {
        let attr = event.currentTarget.getAttribute("attr")
        if (this.state[attr].length >= 1500) { return }

        let err = this.validate(this.state.activePokemon)
        if (Object.values(err).reduce((sum, val) => sum || (val !== ""), false)) {
            this.setState({
                activePokemonNotOk: err,
            })
            return
        }

        let newPok = { ...this.state.activePokemon }
        newPok.CP = calculateCP(newPok.Name, newPok.Lvl, newPok.Atk, newPok.Def, newPok.Sta, this.props.bases.pokemonBase)

        this.setState({
            [attr]: [...this.state.userPokemon, newPok],
            activePokemonNotOk: {},
        })
    }

    validate(obj) {
        return {
            Name: this.check(obj.Name, "Name"),
            QuickMove: this.check(obj.QuickMove, "QuickMove"),
            ChargeMove: obj.ChargeMove === "" && obj.ChargeMove2 === "" ? this.check(obj.ChargeMove, "ChargeMove") : "",
        }
    }

    check(value, type) {
        switch (type) {
            case "Name":
                return value === "" ? strings.userpok.err.errname : ""
            case "QuickMove":
                return value === "" ? strings.userpok.err.errq : ""
            case "ChargeMove":
                return value === "" ? strings.userpok.err.errch : ""
            case "ChargeMove2":
                return value === "" ? strings.userpok.err.errch : ""
            default:
                return ""
        }
    }

    onPokemonDelete(event) {
        const index = Number(event.index)
        this.setState({
            [event.attr]: this.state.userPokemon.filter((val, key) => index !== key),
        })
    }


    onPokemonEdit(pok) {
        //get movepool
        var moves = new MovePoolBuilder();
        moves.createMovePool(pok.Name, this.props.bases.pokemonBase, strings.moveSelect, false,
            [pok.QuickMove], [pok.ChargeMove, pok.ChargeMove2])

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
        if (Object.values(err).reduce((sum, val) => sum || (val !== ""), false)) {
            this.setState({
                editPokemonNotOk: err,
            })
            return
        }
        let newList = [...this.state.userPokemon]
        newList[this.state.editPokemon.index] = this.state.editPokemon
        this.setState({
            showEdit: false,
            userPokemon: newList,
            editPokemonNotOk: {},
            editPokemon: {},
        })
    }

    onTurnOnImport(event) {
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
        return importedArr.length > 1500 ? importedArr.slice(0, 1500) : importedArr
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
            await new Promise(res => setTimeout(res, 4000));
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
        //const isFalseInput = Object.values(this.state.notOk).reduce((sum, val) => sum + (val === "" ? false : true), false)
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/profile/pokemon"
                    header={strings.pageheaders.usrpok}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                {this.state.loading &&
                    <Grid item xs={12}>
                        <LinearProgress color="secondary" />
                    </ Grid>}

                <MagicBox
                    open={Boolean(this.state.showEdit)}
                    onClick={this.onCloseOuterMenu}
                    attr={"showEdit"}
                >
                    <EditMenu
                        attr="editPokemon"

                        pokemonTable={this.props.bases.pokemonBase}
                        moveTable={this.state.moveTable}

                        pokList={this.state.pokList}
                        chargeMoveList={this.state.chargeMoveList}
                        quickMoveList={this.state.quickMoveList}

                        editPokemon={this.state.editPokemon}
                        notOk={this.state.editPokemonNotOk}

                        onChange={this.onChange}
                        onMenuClose={this.onMenuClose}


                        onPokemonEditSubmit={this.onPokemonEditSubmit}
                    />
                </MagicBox>
                {!this.state.loading && !this.state.error &&
                    <Grid item xs={12}>
                        <UserPageContent title={strings.userpok.poktitle}>
                            <PokemonBox
                                limit={1500}
                                attr="userPokemon"

                                onImport={this.onImport}
                                onTurnOnImport={this.onTurnOnImport}
                                showImportExportPanel={this.state.showImport}


                                onPokemonAdd={this.onPokemonAdd}
                                onPokemonDelete={this.onPokemonDelete}
                                onPokemonEdit={this.onPokemonEdit}

                                notOk={this.state.activePokemonNotOk}
                                pokemonTable={this.props.bases.pokemonBase}
                                moveTable={this.state.moveTable}
                                userList={this.state.userPokemon}
                            >
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
                                    notOk={this.state.activePokemonNotOk}

                                    onChange={this.onChange}

                                    onClick={this.onMenuClose}
                                />
                            </PokemonBox>


                        </UserPageContent>

                        <Box mt={5}>
                            <UserPageContent title={strings.userpok.grouptitle}>
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
                            </UserPageContent>
                        </Box>
                    </Grid>}

                {!this.state.loading && this.state.userPokemon &&
                    <Grid item container xs={12} justify="center">
                        <Box pt={3}>
                            <Button
                                loading={this.state.submitting}
                                title={strings.userpok.changes}
                                onClick={this.onSaveChanges}
                                disabled={false}
                                endIcon={<SaveIcon />}
                            />
                        </Box>
                    </Grid>}

                {!!this.state.error &&
                    <Grid item xs={12} md={10} lg={9} >
                        <Box pt={3}>
                            <Alert variant="filled" severity="error">{this.state.error}</Alert >
                        </Box>
                    </Grid>}

                <Snackbar open={this.state.ok} onClose={() => { this.setState({ ok: false }) }}>
                    <Alert variant="filled" severity="success">{strings.success}</Alert >
                </Snackbar>
            </Grid>
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