import { levelData } from "js/bases/levelData";
import { stagesData } from "js/bases/stagesData";
import { checkLvl } from "js/checks/checkLvl";
import { checkIV } from "js/checks/checkIV";

export function calculateEffStat(name, lvl, value, stage, pokBase, what, isShadow) {
    if (!name || !pokBase[name]) {
        return 0
    };
    let stageMultiplier = (what !== "Sta" ? stagesData[stage] : 1)
    let shadowMultipler = (isShadow === "true" ? (what === "Atk" ? 1.2 : 0.833) : 1)

    let effValue = (checkIV(value) + Number(pokBase[name][what])) * levelData[checkLvl(lvl) / 0.5] * stageMultiplier * shadowMultipler
    return what !== "Sta" ? Math.round(effValue * 10) / 10 : Math.trunc(effValue)
}