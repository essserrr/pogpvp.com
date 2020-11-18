export function extractPveObj(array) {
    return {
        FriendshipStage: array[0],
        Weather: array[1],
        DodgeStrategy: array[2],

        PartySize: array[3],
        PlayersNumber: array[4],
        IsAggresive: array[5],

        SupportSlotEnabled: array[6],
    }
}