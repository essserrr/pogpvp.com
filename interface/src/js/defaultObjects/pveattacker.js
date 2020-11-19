const maxLevel = 40;

export function pveattacker() {
    return {
        Name: "", QuickMove: "", ChargeMove: "",
        Lvl: String(maxLevel), Atk: "15", Def: "15", Sta: "15",
        IsShadow: "false", quickMovePool: "", chargeMovePool: "",
    }
}