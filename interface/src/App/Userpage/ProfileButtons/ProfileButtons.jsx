import React from "react";
import { getCookie } from "../../../js/getCookie"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip";


import LocalizedStrings from "react-localization";
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
                <Link className={"col-auto single-button px-0" + (this.props.activePath === "info" ? " active" : "")}
                    to="/profile/info">{strings.upage.inf}</Link>
                <Link className={"col-auto single-button px-0" + (this.props.activePath === "security" ? " active" : "")}
                    to="/profile/security">{strings.upage.sec}</Link>
                <div className={"col-auto single-button--fake  px-0" + (this.props.activePath === "pokemon" ? " active" : "")}
                    data-tip data-for={"broker"}>{strings.upage.p}</div>
                <Link className={"col-auto single-button px-0" + (this.props.activePath === "move" ? " active" : "")}
                    to="/profile/move">{strings.upage.m}</Link>
                <div className={"col-auto single-button--fake px-0" + (this.props.activePath === "shinybroker" ? " active" : "")}
                    data-tip data-for={"broker"}>{strings.upage.shbr}</div>
                <ReactTooltip
                    className={"infoTip"}
                    id={"broker"} effect="solid"
                    place={"right"}
                    multiline={true}
                >
                    {strings.soon}
                </ReactTooltip>
            </div >
        );
    }
}

/*
<Link className={"col-auto single-button disabled px-0" + (this.props.activePath === "pokemon" ? " active" : "")}
                    to="/profile/pokemon" data-tip data-for={"broker"}>{strings.upage.p}</Link>
                
                <Link className={"col-auto single-button disabled px-0" + (this.props.activePath === "shinybroker" ? " active" : "")}
                    to="/profile/shinybroker" data-tip data-for={"broker"}>{strings.upage.shbr}</Link>
*/

export default ProfileButtons