const maxLevel = 40;

export function extractPokemon(array) {
    return {
        name: array[5], Lvl: array[1], Atk: array[2], Def: array[3], Sta: array[4], Shields: array[0],
        AtkStage: array[6], DefStage: array[7], InitialHP: array[8], InitialEnergy: array[9], IsGreedy: array[10], IsShadow: array[11],
        QuickMove: array[12], ChargeMove1: array[13], ChargeMove2: array[14],
        quickMovePool: "", chargeMovePool: "",
        effAtk: "", effDef: "", effSta: "",
        maximizer: {
            stat: "Overall",
            level: String(maxLevel),
            action: "Default",
        },
        HP: undefined, Energy: undefined,
    }
}