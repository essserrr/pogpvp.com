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
            <div className="seluser row mx-0  p-1 justify-content-start">
                <div className="col-12 px-0">
                    <div className="usercard-broker row my-1 mx-0 px-2 py-1 align-items-center justify-content-between text-center">
                        <div className="col-2 px-1 text-left">{"Name"}</div>
                        <div className="col-3 px-1">{"Country"}</div>
                        <div className="col-3 px-1">{"Region"}</div>
                        <div className="col-2 px-1">{"City"}</div>
                        <div className="col-1 px-1">{"Have"}</div>
                        <div className="col-1 px-1">{"Want"}</div>
                    </div>
                </div>
                {Object.values(this.props.list).map((value) =>
                    <div className="col-12 px-0">
                        <UserCard
                            key={value.Username}
                            value={value}
                            pokemonTable={this.props.pokemonTable}
                        />
                    </div>)}
            </div>
        );
    }
}

export default SelectedUsers
