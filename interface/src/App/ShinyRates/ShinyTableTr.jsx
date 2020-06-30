import React from "react";
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"




const ShinyTableTr = React.memo(function (props) {
    return (
        <tr className="animShiny">
            <th className="text-center text-sm-left px-0" scope="row">
                <PokemonIconer
                    src={props.pokTable[props.pok.Name].Number + (props.pokTable[props.pok.Name].Forme !== "" ? "-" + props.pokTable[props.pok.Name].Forme : "")}
                    class={"icon24 p-0 m-0 mr-1 "} />{props.pok.Name}
            </th>
            <td className="px-0 fBolder" >{"1/" + props.pok.Odds + " (" + (1 / props.pok.Odds * 100).toFixed(2) + "%)"}</td>
            <td className="px-0 fBolder" >{"1/" + processRate(props.pok.Odds)}</td>
            <td className="px-0 fBolder" >{props.pok.Checks}</td>
        </tr>
    )

});

export default ShinyTableTr;

function processRate(chance) {
    for (let i = ratesList.length - 1; i >= 0; i--) {
        if (chance === ratesList[i]) {
            return ratesList[i]
        }
        if (chance < ratesList[i]) {
            continue
        }

        if (!ratesList[i + 1]) {
            return ratesList[i]
        }
        let deltaLeft = chance - ratesList[i]
        let deltaRight = ratesList[i + 1] - chance
        switch (true) {
            case deltaLeft > deltaRight:
                return ratesList[i + 1]
            case deltaLeft < deltaRight:
                return ratesList[i]
            default:
                return ratesList[i + 1]
        }
    }
    return ratesList[0]
}

var ratesList = [
    24,
    60,
    90,
    120,
    240,
    450,
    800,
]