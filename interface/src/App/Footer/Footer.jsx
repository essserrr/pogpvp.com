import React from "react"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { getCookie } from "../../js/getCookie"
import { userLocale } from "../../locale/userLocale"

import "./Footer.scss"

let strings = new LocalizedStrings(userLocale)

class Footer extends React.PureComponent {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div data-nosnippet className="footer">
                <p className="m-0 px-2">©2020 pogPvP.com  <Link to="/privacy" title={strings.pol.p}>{strings.pol.p}</Link>  <Link to="/terms" title={strings.pol.t}>{strings.pol.t}</Link></p>
                <p className="m-0 px-2">
                    Icons made by <a href="https://www.flaticon.com/authors/roundicons-freebies" title="Roundicons Freebies">Roundicons Freebies</a>
                </p>
                <p className="m-0 px-2 pb-1">Pokémon is Copyright Gamefreak, Nintendo and The Pokémon Company 2001-2018. All images and names owned and trademarked by Gamefreak, Nintendo, The Pokémon Company, and Niantic are property of their respective owners.</p>
            </div>
        );
    }
}

export default Footer

