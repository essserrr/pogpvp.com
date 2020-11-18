export function extractName(name) {
    let splitted = name.split(" ")

    if (splitted.length === 1) {
        return { Name: name, Additional: "" }
    }
    if (splitted[0] === "Galarian" || splitted[0] === "Alolan" || splitted[0] === "Black" || splitted[0] === "White" ||
        splitted[0] === "Armored" || splitted[0] === "Mega" || splitted[0] === "Primal") {
        return {
            Name: splitted[1],
            Additional: splitted[0] + ((splitted.length > 2) ? ", " + splitted.slice(2).join(" ").replace(/[()]/g, "") : "")
        }
    }
    return { Name: splitted[0], Additional: splitted.slice(1).join(" ").replace(/[()]/g, "") }
}