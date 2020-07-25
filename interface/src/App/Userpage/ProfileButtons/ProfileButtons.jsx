import React from "react";
import { getCookie } from "../../../js/getCookie"

import LocalizedStrings from "react-localization";
import { locale } from "../../../locale/locale"

import "./ProfileButtons.scss"

let strings = new LocalizedStrings(locale);


class ProfileButtons extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.onClick = this.onClick.bind(this)
    }

    onClick(event) {
        console.log(event.target.getAttribute("name"))
        this.props.history.push(event.target.getAttribute("name"))
    }

    render() {

        return (
            <div className="col-auto profile-buttons px-0">
                <div onClick={this.onClick} name="/profile"
                    className={"col-auto profile__singleb px-0" + (!this.props.activePath ? " active" : "")}>
                    User info
                </div>
                <div onClick={this.onClick} name="/profile/pokemon"
                    className={"col-auto profile__singleb disabled px-0" + (this.props.activePath === "pokemon" ? " active" : "")}>
                    User's pokemon
                </div>
                <div onClick={this.onClick} name="/profile/move"
                    className={"col-auto profile__singleb disabled px-0" + (this.props.activePath === "move" ? " active" : "")}>
                    User's moves
                </div>
                <div onClick={this.onClick} name="/profile/shinybroker"
                    className={"col-auto profile__singleb disabled px-0" + (this.props.activePath === "shinybroker" ? " active" : "")}>
                    Shiny broker
                </div>
            </div>

        );
    }
}



export default ProfileButtons