import React from "react";
import { getCookie } from "../../../js/getCookie"
import { Link } from "react-router-dom"
import { Switch, Route } from "react-router-dom"

import LocalizedStrings from "react-localization";
import { userLocale } from "../../../locale/userLocale"
import Info from "../Info/Info"
import Security from "../Security/Security"

import "./UserButtons.scss"

let strings = new LocalizedStrings(userLocale);


class UserButtons extends React.PureComponent {
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
        console.log(this.props.match.params.type)
        return (
            <>
                <div className="col-auto px-0">
                    <Link className={"col-auto user__singleb px-0" + (this.props.match.params.type === "info" ? " active" : "")}
                        to="/profile/user/info">{strings.upage.inf}</Link>
                    <Link className={"col-auto user__singleb px-0" + (this.props.match.params.type === "security" ? " active" : "")}
                        to="/profile/user/security">{strings.upage.sec}</Link>
                </div >
                <Switch>
                    <Route path="/profile/user/info" component={Info} />
                    <Route path="/profile/user/security" component={Security} />
                </Switch>
            </>
        );
    }
}

export default UserButtons