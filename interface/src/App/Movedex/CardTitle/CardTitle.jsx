import React from "react";
import LocalizedStrings from "react-localization";

import { typeDecoder } from "../../../js/indexFunctions"
import { getCookie } from "../../../js/getCookie"
import { dexLocale } from "../../../locale/dexLocale"
import Type from "../../PvP/components/CpAndTypes/Type"

let strings = new LocalizedStrings(dexLocale);

const CardTitle = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="row m-0 p-0 pb-1 mb-2 movecardTitle">
            <Type
                abbrStyle="initialism align-self-center"
                class={"ml-2  mr-1 icon24"}
                code={props.move.MoveType}
                value={typeDecoder[props.move.MoveType]} />
            <h3 className={"align-self-center m-0"}>
                {props.move.Title}
            </h3>
            <h5 className={"align-self-center m-0 ml-1"}>
                ({props.move.MoveCategory === "Charge Move" ? strings.chm : strings.qm})
            </h5>
        </div>
    )

});

export default CardTitle;