export function extractPveBoss(array) {
    return {
        Name: array[0], QuickMove: array[1], ChargeMove: array[2],
        Tier: array[3], quickMovePool: "", chargeMovePool: "",
    }
}