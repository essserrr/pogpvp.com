import React from "react";
import LocalizedStrings from "react-localization";

import { getCookie } from "../../js/indexFunctions"
import { userLocale } from "../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class Footer extends React.PureComponent {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div data-nosnippet className="footer">
                <p className="m-0 px-2">©2020 pogPvP.com  <a href="/privacy" title={strings.pol.p}>{strings.pol.p}</a>  <a href="/terms" title={strings.pol.t}>{strings.pol.t}</a></p>
                <p className="m-0 px-2">
                    Icons made by <a href="https://www.flaticon.com/authors/roundicons-freebies" title="Roundicons Freebies">Roundicons Freebies</a>
                </p>
                <p className="m-0 px-2 pb-1">Pokémon is Copyright Gamefreak, Nintendo and The Pokémon Company 2001-2018. All images and names owned and trademarked by Gamefreak, Nintendo, The Pokémon Company, and Niantic are property of their respective owners.</p>
            </div>
        );
    }
}

export default Footer

