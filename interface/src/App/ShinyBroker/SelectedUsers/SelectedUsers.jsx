import React from "react"
import LocalizedStrings from "react-localization"

import UserCard from "./UserCard/UserCard"

import { getCookie } from "../../../js/getCookie"
import { userLocale } from "../../../locale/userLocale"

import "./SelectedUsers.scss"

let strings = new LocalizedStrings(userLocale)

class SelectedUsers extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="ushiny row mx-0  p-2 justify-content-start">
                {Object.values(this.props.list).map((value) =>
                    <UserCard
                        key={value.Username}
                        value={value}
                        pokemonTable={this.props.pokemonTable}
                    />)}
            </div>
        );
    }
}

export default SelectedUsers
