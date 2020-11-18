export function returnVunStyle(rate) {
    if (rate > 1.600) {
        return "2"
    }
    if (rate > 1.000) {
        return "1"
    }
    if (rate === "1.000") {
        return "0"
    }
    if (rate > 0.391) {
        return "3"
    }
    return "4"
}