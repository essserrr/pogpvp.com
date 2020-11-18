export function encodePveAttacker(data) {
    let res = [
        data.Name, data.QuickMove, data.ChargeMove,
        data.Lvl, data.Atk, data.Def, data.Sta,
        data.IsShadow,
    ]
    return encodeURIComponent(res.join("_"));
}