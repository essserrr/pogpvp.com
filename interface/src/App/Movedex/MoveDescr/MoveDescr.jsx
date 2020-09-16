import React from "react"
import LocalizedStrings from "react-localization"

import { getCookie } from "../../../js/getCookie"
import { dexLocale } from "../../../locale/dexLocale"

let strings = new LocalizedStrings(dexLocale);

const MoveDescr = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <p className="col-12 col-sm-6 col-md-4 text-center text-sm-left m-0 px-1 py-1" >
                <span className="font-weight-bold">{strings.mt.rd}</span> - {strings.tip.rd}
            </p>
            <p className="col-12 col-sm-6 col-md-4 text-center text-sm-left m-0 px-1 py-1" >
                <span className="font-weight-bold">{strings.mt.re}</span> - {strings.tip.re}
            </p>
            <p className="col-12 col-sm-6 col-md-4 text-center text-sm-left m-0 px-1 py-1" >
                <span className="font-weight-bold">{strings.mt.cd}</span> - {strings.tip.cd}
            </p>
            <p className="col-12 col-sm-6 col-md-4 text-center text-sm-left m-0 px-1 py-1" >
                <span className="font-weight-bold">{strings.mt.pd}</span> - {strings.tip.pd}
            </p>
            <p className="col-12 col-sm-6 col-md-4 text-center text-sm-left m-0 px-1 py-1" >
                <span className="font-weight-bold">{strings.mt.pe}</span> - {strings.tip.pe}
            </p>
            <p className="col-12 col-sm-6 col-md-4 text-center text-sm-left m-0 px-1 py-1" >
                <span className="font-weight-bold">{strings.mt.dr}</span> - {strings.tip.dr}
            </p>
            <p className="col-12 col-sm-6 col-md-4 text-center text-sm-left m-0 px-1 py-1" >
                <span className="font-weight-bold">{strings.mt.ef}</span> - {strings.tip.ef}
            </p>
        </>
    )

});

export default MoveDescr;