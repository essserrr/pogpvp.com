import { levelData } from "js/bases/levelData";
import { checkLvl } from "js/checks/checkLvl";

export function returnEffAtk(AtkIV, Atk, Lvl, isShadow) {
    return (Number(AtkIV) + Atk) * levelData[checkLvl(Lvl) / 0.5] * (isShadow === "true" ? 1.2 : 1)
}
