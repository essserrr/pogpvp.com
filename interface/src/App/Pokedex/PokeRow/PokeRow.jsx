import React from "react";
import LocalizedStrings from "react-localization";

import Type from "../../PvP/components/CpAndTypes/Type"
import { getCookie, typeDecoder } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"

let strings = new LocalizedStrings(dexLocale);

const PokeRow = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <tr className="animShiny">
            <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.Number}</td>
            <th className="align-middle text-center text-sm-left px-0 px-sm-1 max110" scope="row">
                <PokemonIconer
                    src={props.value.Number + (props.value.Forme !== "" ? "-" + props.value.Forme : "")}
                    class={"icon36 mr-1"} />
                <a title={strings.dexentr + props.value.Title}
                    className="link"
                    href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.value.Title)}
                >
                    {props.value.Title}
                </a>
            </th>
            <td className="align-middle px-0 ">
                <Type
                    class={"mx-1 icon18"}
                    code={props.value.Type[0]}
                    value={typeDecoder[props.value.Type[0]]}
                />
                {props.value.Type.length > 1 && <Type
                    class={"mr-1 icon18"}
                    code={props.value.Type[1]}
                    value={typeDecoder[props.value.Type[1]]}
                />}
            </td>
            <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.Generation}</td>
            <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.Atk}</td>
            <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.Def}</td>
            <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.Sta}</td>
            <td className="align-middle fBolder px-0 px-sm-1 px-md-3 " >{props.value.CP}</td>
        </tr>
    )

});

export default PokeRow;