export function selectCharge(movelist, moveTable, pokName, pokTable) {
    let primaryName = ""
    let bestScore = 0
    let bestEnergy = 0
    let primaryType = ""
    //define primary move
    //for every move
    movelist.forEach((move) => {
        //exept select option
        if (move.value === "Select..." || move.value === "") {
            return
        }
        //filter self-harm moves
        if (moveTable[move.value].StageDelta < 0 && moveTable[move.value].Subject === "Self") {
            return
        }
        let damage = moveTable[move.value].PvpDamage
        let energy = -moveTable[move.value].PvpEnergy
        let stab = (pokTable[pokName].Type.includes(moveTable[move.value].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = stab * damage / Math.pow(energy, 2)
        switch (true) {
            case score > bestScore:
                bestScore = score
                bestEnergy = energy
                primaryName = moveTable[move.value].Title
                primaryType = moveTable[move.value].MoveType
                break
            case score === bestScore:
                if (energy < bestEnergy) {
                    bestScore = score
                    bestEnergy = energy
                    primaryName = moveTable[move.value].Title
                    primaryType = moveTable[move.value].MoveType
                }
                break
            default:
        }
    })

    //define secondary move
    //for every move
    bestEnergy = 0
    bestScore = 0
    let secodaryName = ""
    let secondaryType = ""

    movelist.forEach((move) => {
        //exept select option and primary move
        if (move.value === "Select..." || move.value === "" || move.value === primaryName) {
            return
        }
        let damage = moveTable[move.value].PvpDamage
        let energy = -moveTable[move.value].PvpEnergy
        let stab = (pokTable[pokName].Type.includes(moveTable[move.value].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = stab * damage / Math.pow(energy, 2)

        switch (true) {
            case score > bestScore:
                bestScore = score
                bestEnergy = energy
                secodaryName = moveTable[move.value].Title
                secondaryType = moveTable[move.value].MoveType
                break
            case score === bestScore:
                if (energy < bestEnergy) {
                    bestScore = score
                    bestEnergy = energy
                    secodaryName = moveTable[move.value].Title
                    secondaryType = moveTable[move.value].MoveType
                }
                break
            case primaryType === secondaryType:
                if (primaryType !== moveTable[move.value].MoveType) {
                    bestScore = score
                    bestEnergy = energy
                    secodaryName = moveTable[move.value].Title
                    secondaryType = moveTable[move.value].MoveType
                }
                break
            default:
        }
    })



    return { primaryName, secodaryName }
}