import React from "react";
import LocalizedStrings from "react-localization";

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import Move from "./Move"

let strings = new LocalizedStrings(dexLocale);

const MoveCol = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className={"col-12 col-sm-6 " + props.class}>
            <div className="col-12 p-0 dexFont">
                {props.title}
            </div>
            {props.value.map((elem) => <Move
                key={elem}
                value={props.moveTable[elem]}
                pok={props.pok}
            />)}
        </div>
    )

});

export default MoveCol;