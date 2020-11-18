import { levelData } from "js/bases/levelData";
import { checkLvl } from "js/checks/checkLvl";
import { checkIV } from "js/checks/checkIV";

export function calculateCP(name, Lvl, Atk, Def, Sta, pokBase) {
    if (!name || !pokBase[name]) {
        return 0
    }
    let cpAtLvl = Math.trunc(((checkIV(Atk) + Number(pokBase[name].Atk)) * Math.pow((checkIV(Def) + Number(pokBase[name].Def)), 0.5) *
        Math.pow((checkIV(Sta) + Number(pokBase[name].Sta)), 0.5) * Math.pow(levelData[checkLvl(Lvl) / 0.5], 2)) / 10)
    if (cpAtLvl < 10) {
        cpAtLvl = 10
    }
    return cpAtLvl
}