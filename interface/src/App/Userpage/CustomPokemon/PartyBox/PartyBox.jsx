import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';

import Button from "App/Components/Button/Button";
import ActiveParty from "App/Userpage/CustomPokemon/PartyBox/ActiveParty/ActiveParty";
import PokemonSelect from "App/Userpage/CustomPokemon/PartyBox/PokemonSelect/PokemonSelect";
import PartiesSelect from "App/Userpage/CustomPokemon/PartyBox/PartiesSelect/PartiesSelect";
import Input from "App/Components/Input/Input";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";
import { errors } from "locale/UserPage/Errors";

let strings = new LocalizedStrings(userLocale);
let errorStrings = new LocalizedStrings(errors);

class PartyBox extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        errorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            enteredName: {
                value: "",
                error: ""
            },
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




    onPokemonAdd(event, attributes, selectOption) {
        if (this.state[attributes.name].length >= 6) { return }
        this.setState({
            [attributes.name]: [...this.state[attributes.name], this.props.userPokemon[selectOption.index]]
        })
    }

    onPokemonDelete(event) {
        const index = Number(event.index)
        this.setState({
            [event.attr]: this.state[event.attr].filter((val, key) => index !== key),
        })
    }


    onGroupAdd() {
        if (this.state.activeParty.length === 0 || !this.validate()) { return }
        if (Object.keys(this.props.userParties).length >= 24) { return }

        let deTrailedPartyName = this.state.enteredName.value.replace(/^[^\w]+|[^\w]+$/g, "")
        this.props.onGroupAdd(this.state.activeParty, deTrailedPartyName)
        this.setState({
            activePartyName: "",
            activeParty: [],
        })
    }

    validate() {
        const err = this.check(this.state.enteredName.value, "enteredName")
        this.setState({
            enteredName: {
                ...this.state.enteredName,
                error: err,
                value: this.state.enteredName.value,
            },
        })
        return err === ""
    }

    onGroupDelete() {
        this.props.onGroupDelete(this.state.activePartyName)
        this.setState({
            activePartyName: "",
            activeParty: [],
        })
    }

    onPartySelect(event, attributes, selectOption) {
        this.setState({
            activePartyName: selectOption.value1,
            activeParty: this.props.userParties[selectOption.value1],
        })

    }

    onNameChange(event) {
        let name = event.target.name
        const value = event.target.value.replace(/[/\\?%*:{}|["'<>]/g, "");

        this.setState({
            [name]: {
                ...this.state[name],
                error: this.check(value, name),
                value: value,
            },
        })
    }

    check(value, type) {
        switch (type) {
            case "enteredName":
                return this.checkName(value)
            default:
                return ""
        }
    }

    checkName(name) {
        if (name === "") {
            return errorStrings.err.ness
        }
        return ""
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
                            <Button
                                attr={this.props.attr}
                                onClick={this.onGroupDelete}
                                title={strings.userpok.deletegroup}
                                endIcon={<DeleteIcon />}
                            />
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
                        name="enteredName"
                        value={this.state.enteredName.value}
                        errorText={this.state.enteredName.error}

                        onChange={this.onNameChange}
                    />
                </Grid>

                <Grid item container xs={12} justify="center">
                    <Button
                        attr={this.props.attr}
                        onClick={this.onGroupAdd}
                        title={strings.userpok.savegroup}
                        endIcon={<AddCircleIcon />}
                    />
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

export default PartyBox;

PartyBox.propTypes = {
    onGroupAdd: PropTypes.func,
    onGroupDelete: PropTypes.func,

    userParties: PropTypes.object,
    userPokemon: PropTypes.arrayOf(PropTypes.object),

    attr: PropTypes.string,

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};