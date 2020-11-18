export function extractData(league, pok1, pok2) {
    let attacker = decodeURIComponent(pok1).split("_")
    let defender = decodeURIComponent(pok2).split("_")
    return {
        attacker: (attacker.length === 15) ? attacker : undefined,
        defender: (defender.length === 15) ? defender : undefined,
        league: (league === "great" || league === "ultra" || league === "master") ? league : undefined
    }
}