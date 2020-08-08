import React from "react";
import { Link } from "react-router-dom"

import { getCookie } from "../../../../js/getCookie"

import LocalizedStrings from "react-localization"
import { locale } from "../../../../locale/locale"

import "./LoginReg.scss"

let strings = new LocalizedStrings(locale)


class LoginReg extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
        }
    }

    render() {
        return (
            <>
                <Link className="align-self-center loginReg__link" title={strings.navbar.lin} to="/login">
                    <i className="fas fa-sign-in-alt fa-2x mr-3 clickable"></i>
                </Link>
                <Link className="align-self-center loginReg__link" title={strings.navbar.sup} to="/registration">
                    <i className="fas fa-user-plus fa-2x mr-3 clickable"></i>
                </Link>
            </>
        );
    }
}


export default LoginReg