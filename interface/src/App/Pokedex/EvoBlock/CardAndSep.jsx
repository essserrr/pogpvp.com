import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import { ReactComponent as Candy } from "../../../icons/candy.svg";

let strings = new LocalizedStrings(dexLocale);

const CardAndSep = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            <div className="separator fBolder" >
                {props.candies > 0 ? <span className="font-weight-bold">{props.candies}</span> : ""}
                {props.candies > 0 ? <Candy className="icon18 mx-1" /> : null}
                {strings.stage + " " + (props.i + 1)}
            </div>
            <div className="row m-0 p-0 justify-content-center">
                {props.elem}
            </div>
        </>
    )
});

export default CardAndSep;