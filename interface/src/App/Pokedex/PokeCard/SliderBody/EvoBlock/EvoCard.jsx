import React from "react"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { getCookie } from "js/getCookie"
import { dexLocale } from "locale/dexLocale"


import Iconer from "App/Components/Iconer/Iconer"


import "./EvoCard.scss"

let strings = new LocalizedStrings(dexLocale)


const EvoCard = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <div className="col-6 col-lg-4 px-1 mt-1 text-center">
            <div className="col-12 p-0">
                {"#" + props.pokTable[props.name].Number + " " + props.name + " "}

            </div>
            <div className="col-12 p-0 mt-1">
                <Iconer
                    className={"icon18"}
                    size={18}
                    folderName="/type/"
                    fileName={String(props.pokTable[props.name].Type[0])}
                />
                {props.pokTable[props.name].Type.length > 1 && <Iconer
                    className={"ml-2 icon18"}
                    size={18}
                    folderName="/type/"
                    fileName={String(props.pokTable[props.name].Type[1])}
                />}
            </div>
            <div className="col-12 p-0 mt-1">
                <Link title={strings.dexentr + props.name}
                    to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + (encodeURIComponent(props.name))}>
                    <Iconer
                        fileName={props.pokTable[props.name].Number + (props.pokTable[props.name].Forme !== "" ? "-" + props.pokTable[props.name].Forme : "")}
                        folderName="/art/"
                        className={"dex-evocard__icon m-1"}
                    />
                </Link>
            </div>
        </div>
    )

});

export default EvoCard;