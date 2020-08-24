import React from "react"
import LocalizedStrings from "react-localization"

import UserShinyCard from "./UserShinyCard/UserShinyCard"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

import "./UserShinyList.scss"

let strings = new LocalizedStrings(userLocale)

class UserShinyList extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="ushiny row mx-0  p-2 justify-content-start">
                {Object.values(this.props.list).map((value) =>
                    <UserShinyCard
                        key={this.props.attr + value.Name}
                        attr={this.props.attr}
                        value={value}
                        pokemonTable={this.props.pokemonTable}
                        onLick={this.props.onPokemonDelete}
                    />)}
            </div>
        );
    }
}

export default UserShinyList
