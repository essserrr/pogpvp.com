export function selectQuick(movelist, moveTable, pokName, pokTable) {
    let bestScore = 0
    let bestName = ""
    //for every move
    movelist.forEach(function (move) {
        //exept select option
        if (move.value === "Select..." || move.value === "") {
            return
        }
        let duration = moveTable[move.value].PvpDurationSeconds
        let damage = moveTable[move.value].PvpDamage
        let energy = moveTable[move.value].PvpEnergy
        //define stab
        let stab = (pokTable[pokName].Type.includes(moveTable[move.value].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = Math.pow(((damage * stab) / duration) * Math.pow(energy / duration, 1.9), 1 / 2)
        if (score > bestScore) {
            bestScore = score
            bestName = moveTable[move.value].Title
        }
    });
    return bestName
}