import { weather } from "js/bases/weather";
import { friendship } from "js/bases/friendship";
import { effectivenessData } from "js/bases/effectivenessData";

export function getPveMultiplier(aTypes, dTypes, mType, weatherType, friendStage) {
    let stabBonus = (aTypes.includes(mType) ? 1.2 : 1)
    let moveEfficiency = effectivenessData[mType]
    let seMultiplier = 1

    dTypes.forEach((elem) => {
        if (moveEfficiency[elem] !== 0) {
            seMultiplier *= moveEfficiency[elem]
        }
    });
    let weatherMul = 1
    if (weather[weatherType][mType]) {
        weatherMul = weather[weatherType][mType]
    }
    return stabBonus * friendship[friendStage] * seMultiplier * weatherMul
}