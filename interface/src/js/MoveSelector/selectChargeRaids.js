export function selectChargeRaids(movelist, moveTable, pokName, pokTable) {
    let primaryName = ""
    let bestScore = 0
    //for every move
    movelist.forEach((move) => {
        //exept select option
        if (move.value === "Select..." || move.value === "") {
            return
        }
        let damage = moveTable[move.value].Damage
        let energy = -moveTable[move.value].Energy
        let duration = moveTable[move.value].Cooldown / 1000
        let stab = (pokTable[pokName].Type.includes(moveTable[move.value].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = (stab * damage / duration) * (stab * damage / energy)
        if (score > bestScore) {
            bestScore = score
            primaryName = moveTable[move.value].Title
        }
    })

    return primaryName
}