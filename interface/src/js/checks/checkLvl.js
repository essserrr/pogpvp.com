const maxLevel = 55;

export function checkLvl(lvl) {
    let lvlNumber = Number(lvl)
    if (isNaN(lvlNumber)) {
        return 0
    }
    if (lvlNumber > maxLevel) {
        return maxLevel
    }
    if (lvlNumber < 0) {
        return 0
    }
    if (!Number.isInteger(lvlNumber / 0.5)) {
        return Math.trunc(lvlNumber)
    }
    return lvl
};