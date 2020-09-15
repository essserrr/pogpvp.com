import React from "react"
import LocalizedStrings from "react-localization"

import ActiveParty from "./ActiveParty/ActiveParty"
import PokemonSelect from "./PokemonSelect/PokemonSelect"
import PartiesSelect from "./PartiesSelect/PartiesSelect"
import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import Input from "../../../PvP/components/Input/Input"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

import "./PartyBox.scss"

let strings = new LocalizedStrings(userLocale)

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
        if (this.state[selectOption.name[0]].length >= 6) { return }

        this.setState({
            [selectOption.name[0]]: [...this.state[selectOption.name[0]], this.props.userPokemon[event.index]]
        })
    }

    onPokemonDelete(event) {
        let attr = event.target.getAttribute("attr")
        let index = Number(event.target.getAttribute("index"))

        this.setState({
            [attr]: this.state[attr].filter((val, key) => index !== key),
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

    onPartySelect(event) {
        this.setState({
            activePartyName: event.value,
            activeParty: this.props.userParties[event.value],
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
            <div className="row mx-0 justify-content-center">
                <div className="col-7 px-0 px-1">
                    <PartiesSelect
                        label={strings.userpok.parties}
                        attr="activeParty"
                        maxSize={24}

                        list={this.props.userParties}
                        activePartyName={this.state.activePartyName}
                        onChange={this.onPartySelect}
                    />
                </div>

                <div className="col-6 px-1 mt-2">
                    <PokemonSelect
                        label={strings.userpok.selectpok}
                        attr="activeParty"

                        pokemonTable={this.props.pokemonTable}
                        list={this.props.userPokemon}
                        onChange={this.onPokemonAdd}
                    />
                </div>
                <div className="col-6 px-1 mt-2">
                    <div className="partybox__text col-12 px-0">{strings.userpok.partyname}</div>
                    <Input
                        class="modifiedBorder form-control"
                        attr={"enteredName"}
                        value={this.state.enteredName}

                        onChange={this.onNameChange}
                        place={strings.userpok.partyname}
                    />
                </div>

                <div className="col-12 px-0 mt-3">
                    <div className="row  justify-content-center align-items-center mx-0" >
                        <SubmitButton
                            class="submit-button--lg btn btn-primary btn-sm mx-3"
                            attr={this.props.attr}
                            label={strings.userpok.savegroup}
                            onSubmit={this.onGroupAdd} />
                        <SubmitButton
                            class="submit-button--lg btn btn-primary btn-sm mx-3"
                            attr={this.props.attr}
                            label={strings.userpok.deletegroup}
                            onSubmit={this.onGroupDelete} />
                    </div>
                </div>

                <div className="col-12 px-0 mt-2 mb-2">
                    <ActiveParty
                        maxSize={6}
                        label={strings.userpok.actparty}
                        attr="activeParty"
                        list={this.state.activeParty}


                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        onPokemonDelete={this.onPokemonDelete}
                    />
                </div>

            </div>
        );
    }
}

export default PartyBox

