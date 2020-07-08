import React from "react";
import LocalizedStrings from "react-localization";

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"


let strings = new LocalizedStrings(dexLocale);

const ListElement = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="col-6 col-sm-4 col-md-3 p-0">
            <PokemonIconer
                src={props.value.Number + (props.value.Forme !== "" ? "-" + props.value.Forme : "")}
                class={"icon36 mr-2"}
            />
            <a title={strings.dexentr + props.name}
                className="dexFont link"
                href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.name)}
            >{props.name}</a>
        </div>
    )

});

export default ListElement;
