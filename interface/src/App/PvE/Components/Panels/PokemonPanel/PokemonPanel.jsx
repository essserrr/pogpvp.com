import React from "react"
import LocalizedStrings from "react-localization"

import PvePokemon from "../../PvePokemon"

import { locale } from "../../../../../locale/locale"
import { pveLocale } from "../../../../../locale/pveLocale"
import { getCookie } from "../../../../../js/getCookie"

let strings = new LocalizedStrings(locale)
let pveStrings = new LocalizedStrings(pveLocale)

const PokemonPanel = React.memo(function PokemonPanel(props) {
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        return (
            <div className="row mx-0 justify-content-center align-items-center">
                {this.props.title && <div className="col-12 px-0 text-center my-1"><h5 className="fBolder m-0 p-0">{this.props.title}</h5></div>}
                <div className="col-12 px-0">
                    <PvePokemon
                        {...this.props}
                    />
                </div>

            </div>
       )
});

export default PokemonPanel