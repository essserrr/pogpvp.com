export function checkIV(IV) {
    if (isNaN(IV)) {
        return 0
    }
    IV = Number(IV)
    if (IV > 15) {
        return 15
    }
    if (IV < 0) {
        return 0
    }
    if (!Number.isInteger(IV)) {
        return Math.trunc(IV)
    }
    return IV
};