import { effectivenessData } from "js/bases/effectivenessData";

export function calculateMultiplier(aTypes, dTypes, mType) {
    if (!aTypes || !dTypes) {
        return 0
    }
    const pvpMultiplier = 1.3
    let stabBonus = (aTypes.includes(mType) ? 1.2 : 1)
    let moveEfficiency = effectivenessData[mType]
    let seMultiplier = 1

    dTypes.forEach((elem) => {
        if (moveEfficiency[elem] !== 0) {
            seMultiplier *= moveEfficiency[elem]
        }
    });
    return pvpMultiplier * seMultiplier * stabBonus
}