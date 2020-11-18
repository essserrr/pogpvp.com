import { tierHP } from "js/bases/tierHP";

export function calculateBossCP(name, tier, pokBase) {
    if (!name || !pokBase[name]) {
        return 0
    }
    return Math.trunc((15 + Number(pokBase[name].Atk)) * Math.pow(15 + Number(pokBase[name].Def), 0.5) *
        Math.pow(tierHP[tier], 0.5) / 10);
}