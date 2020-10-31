import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import Filters from "App/Userpage/CustomPokemon/PokemonBox/Filters/Filters"
import PokemonBoxTitle from "App/Userpage/CustomPokemon/PokemonBox/PokemonBoxTitle/PokemonBoxTitle"


import UserFilteredList from "./UserFilteredList/UserFilteredList"
import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import MagicBox from "../../../PvP/components/MagicBox/MagicBox"
import ImportExport from "../../../PvP/components/ImportExport/ImportExport"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

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

    render() {
        return (
            <Grid container justify="center">
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









                <div className="row  justify-content-center align-items-center mx-0" >
                    <SubmitButton
                        class="submit-button--lg btn btn-primary btn-sm mx-1 my-2"
                        attr={this.props.attr}
                        onSubmit={this.props.onPokemonAdd}
                    >
                        {strings.userpok.addpok}
                    </SubmitButton>
                    <div className="pokbox__text col-12 col-md-auto mx-1 px-0 text-center">{strings.userpok.or}</div>
                    <SubmitButton
                        class="submit-button--lg btn btn-primary btn-sm mx-1 my-2"
                        attr={this.props.attr}
                        onSubmit={this.props.onTurnOnImport}
                    >
                        {strings.impExp}
                    </SubmitButton>
                </div>

                <Grid item xs={12}>
                    <PokemonBoxTitle
                        onClick={this.onClick}
                        have={this.props.userList.length}
                        limit={this.props.limit}
                        showCollapse={this.state.showCollapse}
                    />
                </Grid>


                <Grid item xs={12}>
                    <Collapse in={this.state.showCollapse}>
                        <Filters
                            value={this.state.filters}
                            attr="filters"
                            onChange={this.onChange}
                        />
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    <UserFilteredList
                        attr={this.props.attr}
                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        filters={this.state.filters}

                        onPokemonDelete={this.props.onPokemonDelete}
                        onPokemonEdit={this.props.onPokemonEdit}
                    >
                        {this.props.userList}
                    </UserFilteredList>
                </Grid>
            </Grid>
        );
    }
}

export default PokemonBox

