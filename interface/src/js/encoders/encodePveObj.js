export function encodePveObj(data) {
    let res = [
        data.FriendshipStage, data.Weather, data.DodgeStrategy,
        data.PartySize, data.PlayersNumber, data.IsAggresive, data.SupportSlotEnabled
    ]
    return encodeURIComponent(res.join("_"));
}