import React from "react";

import LocalizedStrings from "react-localization";
import { privacy } from "../../../locale/privacy"
import { getCookie } from "../../../js/indexFunctions"
import "./Privacy.scss"

let strings = new LocalizedStrings(privacy)

const Privacy = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className="row justify-content-center mx-1">
            <div data-nosnippet className="col-12 col-sm-11 col-md-9  privacy p-3 mt-3 mb-5">
                <h1>{strings.priv.h1}</h1>

                <p className="privacy--text">{strings.priv.p1}</p>

                <p className="privacy--text">{strings.priv.p2}</p>

                <p className="privacy--text">{strings.priv.p3}</p>

                <p className="privacy--text">{strings.priv.p4}<a href="/terms" title={strings.tandc}>{strings.tandc}</a>{strings.priv.p41}<a href="https://www.privacypolicytemplate.net">Privacy Policy Template</a>{strings.priv.p42}<a href="https://www.disclaimergenerator.org/">Disclaimer Generator</a>.</p>

                <h3>{strings.priv.h3}</h3>

                <p className="privacy--text">{strings.priv.p5}</p>

                <h3>{strings.priv.h3}</h3>

                <p className="privacy--text">{strings.priv.p6}</p>

                <h3>{strings.priv.h4}</h3>

                <p className="privacy--text">{strings.priv.p7}</p>

                <p className="privacy--text">{strings.priv.p8}</p>

                <p className="privacy--text">{strings.priv.p9}<a href="https://www.cookieconsent.com/what-are-cookies/">"What Are Cookies"</a>.</p>

                <h3>{strings.priv.h5}</h3>

                <p className="privacy--text">{strings.priv.p10}</p>

                <h3>{strings.priv.h6}</h3>

                <p className="privacy--text">{strings.priv.p11}</p>

                <h3>{strings.priv.h7}</h3>

                <p className="privacy--text">{strings.priv.p12}</p>

                <h3>{strings.priv.h8}</h3>

                <p className="privacy--text">{strings.priv.p13}</p>

                <h3>{strings.priv.h9}</h3>

                <p className="privacy--text">{strings.priv.p14}</p>
            </div>
        </div>
    )

});

export default Privacy;

