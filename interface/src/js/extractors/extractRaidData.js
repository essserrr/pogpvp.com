export function extractRaidData(attacker, boss, obj, supp) {
    let attackerObj = decodeURIComponent(attacker).split("_")
    let bossObj = decodeURIComponent(boss).split("_")
    let pveObj = decodeURIComponent(obj).split("_")
    let supportPokemon = decodeURIComponent(supp).split("_")
    return {
        attackerObj: (attackerObj.length === 8) ? attackerObj : undefined,
        bossObj: (bossObj.length === 4) ? bossObj : undefined,
        pveObj: (pveObj.length >= 6) ? pveObj : undefined,
        supportPokemon: (supportPokemon.length === 8) ? supportPokemon : undefined,
    }
}