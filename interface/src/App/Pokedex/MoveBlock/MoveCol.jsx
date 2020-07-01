import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import Move from "./Move"

let strings = new LocalizedStrings(dexLocale);

const MoveCol = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    function generateMoves() {
        let arr = []
        for (let i = 0; i < props.value.length; i++) {
            arr.push(<Move
                key={props.value[i]}
                value={props.moveTable[props.value[i]]}
                pok={props.pok}
            />)
        }
        return arr
    }
    return (
        <div className={"col-12 col-sm-6 " + props.class}>
            <div className="col-12 p-0 dexFont">
                {props.title}
            </div>
            {generateMoves()}
        </div>
    )

});

export default MoveCol;