export function encodePveBoss(data) {
    let res = [data.Name, data.QuickMove, data.ChargeMove, data.Tier,]
    return encodeURIComponent(res.join("_"));
}