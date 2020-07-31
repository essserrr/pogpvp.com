import React from "react";
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { getCookie } from "../../../js/getCookie"
import { dexLocale } from "../../../locale/dexLocale"


import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import { typeDecoder } from "../../../js/indexFunctions"
import Type from "../../PvP/components/CpAndTypes/Type"


let strings = new LocalizedStrings(dexLocale)


const EvoCard = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="col-6 col-lg-4 px-1 mt-1 text-center">
            <div className="col-12 p-0">
                {"#" + props.pokTable[props.name].Number + " " + props.name + " "}

            </div>
            <div className="col-12 p-0 mt-1">
                <Type
                    class={"icon18"}
                    code={props.pokTable[props.name].Type[0]}
                    value={typeDecoder[props.pokTable[props.name].Type[0]]}
                />
                {props.pokTable[props.name].Type.length > 1 && <Type
                    class={"ml-2 icon18"}
                    code={props.pokTable[props.name].Type[1]}
                    value={typeDecoder[props.pokTable[props.name].Type[1]]}
                />}
            </div>
            <div className="col-12 p-0 mt-1">
                <Link title={strings.dexentr + props.name}
                    to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + (encodeURIComponent(props.name))}>
                    <PokemonIconer
                        src={props.pokTable[props.name].Number + (props.pokTable[props.name].Forme !== "" ? "-" + props.pokTable[props.name].Forme : "")}
                        folder="/art/"
                        class={"m-1 dexEvoIcon"}
                    />
                </Link>
            </div>
        </div>
    )

});

export default EvoCard;