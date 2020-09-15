import React from "react"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import Type from "../../../../../PvP/components/CpAndTypes/Type"
import { getCookie } from "../../../../../../js/getCookie"
import { dexLocale } from "../../../../../../locale/dexLocale"
import PokemonIconer from "../../../../../PvP/components/PokemonIconer/PokemonIconer"

import "./PokeRow.scss"

let strings = new LocalizedStrings(dexLocale)

const PokeRow = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <tr className="pokerow">
            <td className="align-middle px-0 px-sm-1 px-md-3 " >{props.value.Number}</td>
            <th className="pokerow__fix-width align-middle text-center text-sm-left px-0 px-sm-1" scope="row">
                <PokemonIconer
                    src={props.value.Number + (props.value.Forme !== "" ? "-" + props.value.Forme : "")}
                    class={"pokerow__icon mr-1"} />
                <Link title={strings.dexentr + props.value.Title}
                    className="pokerow__link"
                    to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.value.Title)}>
                    {props.value.Title}
                </Link>
            </th>
            <td className="align-middle px-0 ">
                <Type
                    class={"pokerow__icon-sm mx-1"}
                    code={props.value.Type[0]}
                />
                {props.value.Type.length > 1 && <Type
                    class={"pokerow__icon-sm mr-1"}
                    code={props.value.Type[1]}
                />}
            </td>
            <td className="align-middle px-0 px-sm-1 px-md-3 " >{props.value.Generation}</td>
            <td className="align-middle px-0 px-sm-1 px-md-3 " >{props.value.Atk}</td>
            <td className="align-middle px-0 px-sm-1 px-md-3 " >{props.value.Def}</td>
            <td className="align-middle px-0 px-sm-1 px-md-3 " >{props.value.Sta}</td>
            <td className="align-middle px-0 px-sm-1 px-md-3 " >{props.value.CP}</td>
        </tr>
    )

});

export default PokeRow;