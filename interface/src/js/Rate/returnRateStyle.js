export function returnRateStyle(rate) {
    if (rate >= 630) {
        return ["+2", "4"]
    }
    if (rate > 500) {
        return ["+1", "3"]
    }
    if (rate === 500) {
        return ["0", "0"]
    }
    if (rate >= 370) {
        return ["-1", "1"]
    }
    return ["-2", "2"]
}