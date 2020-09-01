import React from "react";
import { getCookie } from "../../../js/getCookie"
import { Link } from "react-router-dom"

import LocalizedStrings from "react-localization"
import { userLocale } from "../../../locale/userLocale"

import "./ProfileButtons.scss"

let strings = new LocalizedStrings(userLocale);


class ProfileButtons extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.onClick = this.onClick.bind(this)
    }

    onClick(event) {
        this.props.history.push(event.target.getAttribute("name"))
    }

    render() {

        return (
            <div className="col-auto px-0">
                <Link className={"single-button col-auto px-0" + (this.props.activePath === "info" ? " active" : "")}
                    to="/profile/info">{strings.upage.inf}</Link>
                <Link className={"single-button col-auto px-0" + (this.props.activePath === "security" ? " active" : "")}
                    to="/profile/security">{strings.upage.sec}</Link>
                <Link className={"single-button col-auto px-0" + (this.props.activePath === "pokemon" ? " active" : "")}
                    to="/profile/pokemon">{strings.upage.p}</Link>
                <Link className={"single-button col-auto px-0" + (this.props.activePath === "move" ? " active" : "")}
                    to="/profile/move">{strings.upage.m}</Link>
                <Link className={"single-button col-auto px-0" + (this.props.activePath === "shinybroker" ? " active" : "")}
                    to="/profile/shinybroker" >{strings.upage.shbr}</Link>
            </div >
        );
    }
}

export default ProfileButtons