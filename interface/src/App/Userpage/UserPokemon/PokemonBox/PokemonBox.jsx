import React from "react"
import LocalizedStrings from "react-localization"

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
                    <div className="pokbox__text col-12 col-sm-auto mx-1 px-0 text-center">{strings.userpok.or}</div>
                    <SubmitButton
                        class="longButton btn btn-primary btn-sm mx-1 my-2"
                        attr={this.props.attr}
                        label={strings.impExp}
                        onSubmit={this.props.onTurnOnImport} />
                </div>


                <div className="pokbox__text">
                    {`${this.props.label} (${Object.keys(this.props.userList).length}/${this.props.limit})`}
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
                    <UserPokemonList
                        attr={this.props.attr}

                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}
                        list={this.props.userList}

                        onPokemonDelete={this.props.onPokemonDelete}
                        onPokemonEdit={this.props.onPokemonEdit}
                    />
                </div>
            </>
        );
    }
}

export default PokemonBox

