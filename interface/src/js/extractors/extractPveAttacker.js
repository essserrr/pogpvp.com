export function extractPveAttacker(array) {
    return {
        Name: array[0], QuickMove: array[1], ChargeMove: array[2],
        Lvl: array[3], Atk: array[4], Def: array[5], Sta: array[6],
        IsShadow: array[7], quickMovePool: "", chargeMovePool: "",
    }
}