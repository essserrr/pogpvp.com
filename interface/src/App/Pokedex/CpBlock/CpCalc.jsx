import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import CP from "../../PvP/components/CpAndTypes/CP"
import Stats from "../../PvP/components/Stats/Stats";

let strings = new LocalizedStrings(dexLocale);

const CpCalc = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <Stats
                Lvl={props.value.Lvl}
                Atk={props.value.Atk}
                Def={props.value.Def}
                Sta={props.value.Sta}
                attr={props.attr}
                onChange={props.onChange}
            />
            <div className="col-12  text-center">
                <CP
                    class="d-inline mr-2 dexFont font-weight-bold"
                    name={props.pok.Title}
                    isBoss={false}

                    Lvl={props.value.Lvl}
                    Atk={props.value.Atk}
                    Def={props.value.Def}
                    Sta={props.value.Sta}
                    pokemonTable={props.pokeTable}
                />
            </div>
        </>
    )
});

export default CpCalc;