export function separateMovebase(movebase = []) {
    let chargeMoveList = [];
    let quickMoveList = [];
    //create pokemons list

    for (const [key, value] of Object.entries(movebase)) {
        switch (value.MoveCategory) {
            case "Charge Move":
                chargeMoveList.push({
                    value: key,
                    title: key,
                });
                break
            default:
                quickMoveList.push({
                    value: key,
                    title: key,
                });
        }
    }
    return { chargeMoveList, quickMoveList }
}