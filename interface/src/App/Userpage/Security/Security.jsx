import React from "react";
import { getCookie } from "../../../js/getCookie"

import LocalizedStrings from "react-localization";
import { locale } from "../../../locale/locale"


let strings = new LocalizedStrings(locale);


class Security extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {

        return (
            <div className="col pt-2 px-2">
                <div className="col px-0">
                    Some Security native stuff
                </div>
            </div>
        );
    }
}

export default Security