const maxLevel = 40;

export function getUserPok() {
    return {
        Name: "", QuickMove: "", ChargeMove: "", ChargeMove2: "",
        Lvl: String(maxLevel), Atk: "15", Def: "15", Sta: "15",
        IsShadow: "false", quickMovePool: "", chargeMovePool: "",
    }
}