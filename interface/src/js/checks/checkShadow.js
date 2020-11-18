export function checkShadow(name, pokTable) {
    if (!pokTable[name]) {
        let index = name.indexOf(" (Shadow)")
        if (index !== -1) {
            name = name.slice(0, index)
            if (!pokTable[name]) {
                console.log(`Critical: ""${name}" not found in the database`)
                return ""
            }
        }
    }
    return name
}