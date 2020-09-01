import React from "react"
import LocalizedStrings from "react-localization"

import UserPokCard from "./UserPokCard/UserPokCard"

import { getCookie } from "../../../../../js/getCookie"
import { userLocale } from "../../../../../locale/userLocale"

import "./UserPokemonList.scss"

let strings = new LocalizedStrings(userLocale)

class UserShinyList extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="ushiny row mx-0  p-2 justify-content-start">
                {this.props.list.map((value, index) =>
                    <UserPokCard
                        key={index}
                        index={index}

                        attr={this.props.attr}
                        value={value}

                        moveTable={this.props.moveTable}
                        pokemonTable={this.props.pokemonTable}

                        onClick={this.props.onPokemonDelete}
                        onPokemonEdit={this.props.onPokemonEdit}
                    />)}
            </div>
        );
    }
}

export default UserShinyList
