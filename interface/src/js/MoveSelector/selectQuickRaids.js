export function selectQuickRaids(movelist, moveTable, pokName, pokTable) {
    let bestScore = 0
    let bestName = ""
    //for every move
    movelist.forEach(function (move) {
        //exept select option
        if (move.value === "Select..." || move.value === "") {
            return
        }
        let duration = moveTable[move.value].Cooldown / 1000
        let damage = moveTable[move.value].Damage
        //define stab
        let stab = (pokTable[pokName].Type.includes(moveTable[move.value].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = (damage * stab) / duration
        if (score > bestScore) {
            bestScore = score
            bestName = moveTable[move.value].Title
        }
    });
    return bestName
}