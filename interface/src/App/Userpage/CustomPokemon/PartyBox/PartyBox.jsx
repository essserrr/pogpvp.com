import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';

import ActiveParty from "App/Userpage/CustomPokemon/PartyBox/ActiveParty/ActiveParty";
import PokemonSelect from "App/Userpage/CustomPokemon/PartyBox/PokemonSelect/PokemonSelect";
import PartiesSelect from "App/Userpage/CustomPokemon/PartyBox/PartiesSelect/PartiesSelect";
import SubmitButton from "App/PvP/components/SubmitButton/SubmitButton";
import Input from "App/Components/Input/Input";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";

let strings = new LocalizedStrings(userLocale);

class PartyBox extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            enteredName: "",
            activePartyName: "",
            activeParty: []
        }

        this.onPokemonAdd = this.onPokemonAdd.bind(this)
        this.onPokemonDelete = this.onPokemonDelete.bind(this)

        this.onGroupAdd = this.onGroupAdd.bind(this)
        this.onGroupDelete = this.onGroupDelete.bind(this)

        this.onNameChange = this.onNameChange.bind(this)
        this.onPartySelect = this.onPartySelect.bind(this)
    }




    onPokemonAdd(event, selectOption) {
        if (this.state[selectOption.name].length >= 6) { return }

        this.setState({
            [selectOption.name]: [...this.state[selectOption.name], this.props.userPokemon[selectOption.index]]
        })
    }

    onPokemonDelete(event) {
        const index = Number(event.index)
        this.setState({
            [event.attr]: this.state[event.attr].filter((val, key) => index !== key),
        })
    }


    onGroupAdd() {
        if (this.state.activeParty.length === 0 || this.state.enteredName.replace(" ", "") === "") { return }
        if (Object.keys(this.props.userParties).length >= 24) { return }

        let deTrailedPartyName = this.state.enteredName.replace(/^[^\w]+|[^\w]+$/g, "")
        this.props.onGroupAdd(this.state.activeParty, deTrailedPartyName)
        this.setState({
            activePartyName: "",
            activeParty: [],
        })
    }

    onGroupDelete() {
        this.props.onGroupDelete(this.state.activePartyName)
        this.setState({
            activePartyName: "",
            activeParty: [],
        })
    }

    onPartySelect(event, selectOption) {
        this.setState({
            activePartyName: selectOption.value1,
            activeParty: this.props.userParties[selectOption.value1],
        })

    }

    onNameChange(event) {
        let attr = event.target.getAttribute("attr")
        this.setState({
            [attr]: event.target.value.replace(/[/\\?%*:{}|["'<>]/g, ""),
        })
    }


    render() {
        return (
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="center" alignItems="flex-end" spacing={2}>
                        <Grid item xs={12} md={6}>
                            <PartiesSelect
                                label={strings.userpok.parties}
                                name="activeParty"
                                maxSize={24}
                                activePartyName={this.state.activePartyName}
                                onChange={this.onPartySelect}
                            >
                                {this.props.userParties}
                            </PartiesSelect>
                        </Grid>
                        <Grid container item xs={12} md={6} justify="center">
                            <SubmitButton
                                class="submit-button--lg btn btn-primary btn-sm"
                                attr={this.props.attr}
                                onSubmit={this.onGroupDelete}
                            >
                                {strings.userpok.deletegroup}
                            </SubmitButton>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <PokemonSelect
                        label={strings.userpok.selectpok}
                        name="activeParty"
                        pokemonTable={this.props.pokemonTable}
                        onChange={this.onPokemonAdd}

                    >
                        {this.props.userPokemon}
                    </PokemonSelect>
                </Grid>
                <Grid item xs={6}>
                    <Input
                        label={strings.userpok.partyname}
                        attr="enteredName"
                        value={this.state.enteredName}

                        onChange={this.onNameChange}
                    />
                </Grid>

                <Grid item container xs={12} justify="center">
                    <SubmitButton
                        class="submit-button--lg btn btn-primary btn-sm"
                        attr={this.props.attr}
                        onSubmit={this.onGroupAdd}
                    >
                        {strings.userpok.savegroup}
                    </SubmitButton>
                </Grid>

                <Grid item xs={12}>
                    <ActiveParty
                        maxSize={6}
                        label={strings.userpok.actparty}
                        attr="activeParty"
                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        onPokemonDelete={this.onPokemonDelete}
                    >
                        {this.state.activeParty}
                    </ActiveParty>
                </Grid>

            </Grid>
        );
    }
}

export default PartyBox

