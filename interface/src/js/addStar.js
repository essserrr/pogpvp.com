export function addStar(pokName, moveName, pokemonTable) {
    return pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : ""
}