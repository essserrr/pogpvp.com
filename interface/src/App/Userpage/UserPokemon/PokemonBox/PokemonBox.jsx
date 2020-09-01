import React from "react"
import LocalizedStrings from "react-localization"
import { UnmountClosed } from "react-collapse"

import Filters from "./Filters/Filters"
import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import ImportExport from "../../../PvP/components/ImportExport/ImportExport"
import UserPokemonList from "./UserPokemonList/UserPokemonList"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

import "./PokemonBox.scss"

let strings = new LocalizedStrings(userLocale)

class PokemonBox extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            showCollapse: false,

            filters: {
                Name: "",
                QuickMove: "",
                ChargeMove: "",

                Atk: "",
                Def: "",
                Sta: "",
                Lvl: "",

                IsShadow: "",
            },
        }
        this.onClick = this.onClick.bind(this)
        this.applyFilter = this.applyFilter.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            [attr]: {
                ...this.state[attr],
                [event.target.name]: event.target.value,
            }
        })
    }

    onClick() {
        this.setState({
            showCollapse: !this.state.showCollapse,
        })
    }

    applyFilter() {
        return this.props.userList.filter((value) => {
            return (this.containsFilter(value.Name, "Name") * this.containsFilter(value.QuickMove, "QuickMove") *
                this.containsFilter(value.ChargeMove, "ChargeMove") * this.equalFilter(value.Atk, "Atk") *
                this.equalFilter(value.Def, "Def") * this.equalFilter(value.Sta, "Sta") *
                this.equalFilter(value.Lvl, "Lvl") * this.equalFilter(value.IsShadow, "IsShadow"))
        })
    }

    equalFilter(value, key) {
        if (this.state.filters[key] === "" || this.state.filters[key] === value) {
            return true
        }
        return false
    }
    containsFilter(value, key) {
        if (this.state.filters[key] === "") {
            return true
        }
        if (value.toLowerCase().includes(this.state.filters[key].toLowerCase())) {
            return true
        }
        return false
    }

    render() {
        return (
            <>

                <div className="row  justify-content-center align-items-center mx-0" >
                    <SubmitButton
                        class="longButton btn btn-primary btn-sm mx-1 my-2"
                        attr={this.props.attr}
                        label={strings.userpok.addpok}
                        onSubmit={this.props.onPokemonAdd} />
                    <div className="pokbox__text col-12 col-md-auto mx-1 px-0 text-center">{strings.userpok.or}</div>
                    <SubmitButton
                        class="longButton btn btn-primary btn-sm mx-1 my-2"
                        attr={this.props.attr}
                        label={strings.impExp}
                        onSubmit={this.props.onTurnOnImport} />
                </div>

                <div className="col-12 px-0">
                    <div className="row mx-0 justify-content-between align-items-center">
                        <div className="pokbox__text">{`${this.props.label} (${this.props.userList.length}/${this.props.limit})`}</div>
                        <div onClick={this.onClick} className="row mx-0 clickable align-items-center">
                            <div className="pokbox__text">{strings.userpok.filt}</div>
                            <i className={this.state.showCollapse ? "fas fa-angle-up fa-lg px-2" : "fas fa-angle-down fa-lg px-2"}></i>
                        </div>
                    </div>
                </div>

                {this.props.showImportExportPanel && <MagicBox
                    onClick={this.props.onTurnOnImport}
                    attr={this.props.attr}
                    element={
                        <ImportExport
                            type="userPokemon"
                            initialValue={Object.values(this.props.userList)}
                            pokemonTable={this.props.pokemonTable}

                            action="Import/Export"
                            attr={this.props.attr}
                            onChange={this.props.onImport}
                        />
                    }
                />}
                <div className="col-12 px-0 mt-2 mb-2">
                    <UnmountClosed isOpened={this.state.showCollapse}>
                        <Filters
                            value={this.state.filters}
                            attr="filters"

                            onChange={this.onChange}
                        />
                    </UnmountClosed>
                </div>
                <div className="col-12 px-0 mt-2 mb-2">
                    <UserPokemonList
                        attr={this.props.attr}

                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}
                        list={this.applyFilter(this.props.userList)}

                        onPokemonDelete={this.props.onPokemonDelete}
                        onPokemonEdit={this.props.onPokemonEdit}
                    />
                </div>
            </>
        );
    }
}

export default PokemonBox

