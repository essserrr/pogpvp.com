export function processInitialStats(stat) {
    if (isNaN(stat)) {
        return ""
    }
    if (stat < 0) {
        return ""
    }
    if (!Number.isInteger(stat)) {
        return String(Math.floor(stat))
    }
    return String(stat)
}