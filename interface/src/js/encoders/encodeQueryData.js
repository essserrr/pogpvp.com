export function encodeQueryData(data) {
    let res = [
        data.Shields,
        data.Lvl, data.Atk, data.Def, data.Sta, data.name,
        data.AtkStage, data.DefStage, data.InitialHP, data.InitialEnergy, data.IsGreedy, data.IsShadow,
        data.QuickMove, data.ChargeMove1, data.ChargeMove2,
    ]
    return encodeURIComponent(res.join("_"));
}