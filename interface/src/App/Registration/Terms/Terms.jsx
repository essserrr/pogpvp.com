import React from "react";

import LocalizedStrings from "react-localization";
import { privacy } from "../../../locale/privacy"
import { getCookie } from "../../../js/indexFunctions"
import "./Terms.scss"

let strings = new LocalizedStrings(privacy)

const Terms = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className="row justify-content-center mx-1">
            <div data-nosnippet className="col-12 col-sm-11 col-md-9  terms p-3 mt-3 mb-5">
                <h1>{strings.terms.h1}</h1>

                <p className="terms--text">{strings.terms.p1}</p>

                <h3>{strings.terms.h3}</h3>

                <p className="terms--text">{strings.terms.p2}</p>

                <h3>{strings.terms.h3}</h3>

                <p className="terms--text">{strings.terms.p3}<a href="/privacy" title={strings.p}>{strings.p}</a>{strings.terms.p31}</p>

                <h3>{strings.terms.h4}</h3>

                <p className="terms--text">{strings.terms.p4}</p>

                <h3>{strings.terms.h5}</h3>

                <p className="terms--text">{strings.terms.p5}</p>

                <h3>{strings.terms.h6}</h3>

                <p className="terms--text">{strings.terms.p6}</p>

                <h3>{strings.terms.h7}</h3>

                <p className="terms--text">{strings.terms.p7}</p>

                <h3>{strings.terms.h8}</h3>

                <p className="terms--text">{strings.terms.p8}</p>

                <p className="terms--text">{strings.terms.p9}</p>

                <h3>{strings.terms.h9}</h3>

                <p className="terms--text">{strings.terms.p10}</p>

                <h3>{strings.terms.h10}</h3>

                <p className="terms--text">{strings.terms.p11}</p>

                <p className="terms--text">{strings.terms.p12}</p>
            </div>
        </div>
    )

});

export default Terms;

