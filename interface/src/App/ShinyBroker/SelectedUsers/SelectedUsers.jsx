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
                    <div className="seluser-header row mx-0 px-2 py-1 align-items-center justify-content-between text-center">
                        <div className="seluser__cell col-2 px-0 px-sm-1 text-left">{strings.shbroker.int.name}</div>
                        <div className="seluser__cell col-3 px-0 px-sm-1">{strings.shbroker.int.country}</div>
                        <div className="seluser__cell col-2 px-0 px-sm-1">{strings.shbroker.int.region}</div>
                        <div className="seluser__cell col-2 px-0 px-sm-1">{strings.shbroker.int.city}</div>
                        <div className="seluser__cell col-1 px-0 px-sm-1">{strings.shbroker.int.have}</div>
                        <div className="seluser__cell col-1 px-0 px-sm-1">{strings.shbroker.int.want}</div>
                        <div className="seluser__cell col-1 px-0 px-sm-1">{strings.shbroker.int.details}</div>
                    </div>
                </div>
                {Object.values(this.props.list).map((value) =>
                    <div key={value.Username} className="col-12 px-0">
                        <UserCard
                            value={value}
                            pokemonTable={this.props.pokemonTable}
                        />
                    </div>)}
            </div>
        );
    }
}

export default SelectedUsers
