import { capitalizeFirst } from "../../../js/indexFunctions"


export function translateName(name) {
    //prohibited symbols

    name = replacer(name, ["'", /\.$/], ["", ""])
    name = capitalizeFirst(name, true)

    name = deleteSuffix(name, [" Normal", " Shadow", " Purified", " Standard"])
    name = moveSuffixToPrefix(name, [" Alolan", " Galarian"])
    name = makeNewSuffix(name, " (", " Forme)", [" Altered", " Origin", " Attack", " Defence", " Speed", " Normal", " Incarnate"])

    name = makeNewSuffix(name, " (", " Cloak)", [" Plant", " Trash", " Sandy"])
    name = makeNewSuffix(name, " (", " Form)", [" Overcast", " Sunshine"])
    name = makeNewSuffix(name, " (", ")", [" Sunny", " Rainy", " Snowy"])

    name = checkNameInDict(name)

    return name
}

function checkNameInDict(str) {
    let dict = {
        Deoxys: "Deoxys (Normal Forme)",
    }
    if (!!dict[str]) {
        return dict[str]
    }
    return str
}

function deleteSuffix(str, arrOfTargets) {
    for (let i = 0; i < arrOfTargets.length; i++) {
        let index = str.indexOf(arrOfTargets[i])
        if (index !== -1) {
            return str.slice(0, index)
        }
    }
    return str
}

function moveSuffixToPrefix(str, arrOfTargets) {
    for (let i = 0; i < arrOfTargets.length; i++) {
        let index = str.indexOf(arrOfTargets[i])
        if (index !== -1) {
            str = str.slice(0, index)
            return `${arrOfTargets[i].slice(1)} ${str}`
        }
    }
    return str
}

function makeNewSuffix(str, suffixStart, suffixEnd, arrOfTargets) {
    for (let i = 0; i < arrOfTargets.length; i++) {
        let index = str.indexOf(arrOfTargets[i])
        if (index !== -1) {
            str = str.slice(0, index)
            str = `${str}${suffixStart}${arrOfTargets[i].slice(1)}${suffixEnd}`
            break
        }
    }
    return str
}

export function translareMove(moveName) {
    let dictMove = { "Mud-Slap": "Mud Slap", "Super Power": "Superpower" }

    moveName = replacer(moveName, ["_FAST", "_"], ["", " "])
    moveName = capitalizeFirst(moveName, true)

    if (!!dictMove[moveName]) { return dictMove[moveName] }
    if (moveName === " - " || moveName === "-" || moveName === "- ") { return "" }

    return moveName
}

function replacer(string, toFind, toReplace) {
    toFind.forEach((value, index) => { string = string.replace(toFind[index], toReplace[index]) })
    return string
}