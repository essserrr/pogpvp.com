import React from "react";
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/indexFunctions"

let strings = new LocalizedStrings(locale)

const ShinyTableTr = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    function processRate(chance) {
        let ratesList = [24, 60, 90, 120, 240, 450, 800,]
        //in reverse direction
        for (let i = ratesList.length - 1; i >= 0; i--) {
            //if two chances are equal
            if (chance === ratesList[i]) {
                return ratesList[i]
            }
            //if chance to find lower than chance in the table
            if (chance < ratesList[i]) {
                continue
            }
            //if it is the first entry, return it
            if (!ratesList[i + 1]) {
                return ratesList[i]
            }
            //otherwise calculate delta to two nearest chances
            let deltaLeft = chance - ratesList[i]
            let deltaRight = ratesList[i + 1] - chance
            switch (true) {
                case deltaLeft > deltaRight:
                    return ratesList[i + 1]
                case deltaLeft < deltaRight:
                    return ratesList[i]
                default:
                    //return highest by default
                    return ratesList[i + 1]
            }
        }
        return ratesList[0]
    }

    return (
        <tr className="animShiny">
            <th className="text-center align-middle  text-sm-left px-0" scope="row">
                <PokemonIconer
                    src={props.pokTable[props.pok.Name].Number + (props.pokTable[props.pok.Name].Forme !== "" ? "-" + props.pokTable[props.pok.Name].Forme : "")}
                    class={"icon36 mr-1 "} />

                <Link className="link"
                    title={strings.dexentr + props.pok.Name}
                    to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(props.pok.Name)}>
                    {props.pok.Name}
                </Link>
            </th>
            <td className="px-0 align-middle  fBolder" >{"1/" + props.pok.Odds + " (" + (1 / props.pok.Odds * 100).toFixed(2) + "%)"}</td>
            <td className="px-0 align-middle  fBolder" >{"1/" + processRate(props.pok.Odds)}</td>
            <td className="px-0 align-middle  fBolder" >{props.pok.Checks}</td>
        </tr>
    )

});

export default ShinyTableTr;



