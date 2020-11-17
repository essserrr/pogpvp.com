import { addStar } from "js/addStar"

export function getAbbriviation(quickMove, chargeMove1, chargeMove2, pokName, pokemonTable) {

    let abbr = quickMove.replace(/[a-z -]/g, "") + addStar(pokName, quickMove, pokemonTable) +
        ((!!chargeMove1 || !!chargeMove2) ? "+" : "") +
        (chargeMove1 ? (chargeMove1.replace(/[a-z -]/g, "") + addStar(pokName, chargeMove1, pokemonTable)) : "") +
        ((chargeMove1 && chargeMove2) ? "/" : "") +
        (chargeMove2 ? (chargeMove2.replace(/[a-z -]/g, "") + addStar(pokName, chargeMove2, pokemonTable)) : "")

    return abbr
}