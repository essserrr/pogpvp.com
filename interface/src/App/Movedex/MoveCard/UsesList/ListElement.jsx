import React from "react"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"
import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"

import "./ListElement.scss"

let strings = new LocalizedStrings(dexLocale)

const ListElement = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="col-6 col-sm-4 col-md-3 p-0">
            <PokemonIconer
                src={props.value.Number + (props.value.Forme !== "" ? "-" + props.value.Forme : "")}
                class={"uses-listelem__icon mr-2"}
            />
            <Link title={strings.dexentr + props.name}
                className="uses-listelem__link"
                to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.name)}>
                {props.name}
            </Link>
        </div>
    )

});

export default ListElement;
