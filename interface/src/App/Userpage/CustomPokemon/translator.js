import { capitalizeFirst } from "../../../js/indexFunctions"


export function translateName(name) {
    //prohibited symbols

    name = replacer(name, ["'", /\.$/], ["", ""])
    name = capitalizeFirst(name, true)

    name = deleteSuffix(name, [" Normal", " Shadow", " Purified", " Standard"])
    name = moveSuffixToPrefix(name, [" Alolan", " Galarian"])
    name = makeNewSuffix(name, " (", " Forme)", [" Altered", " Origin", " Attack", " Defence", " Speed", " Normal", " Incarnate"])

    name = movePrefixToSuffix(name, " (", ")", ["Wash ", "Mow ", "Heat ", "Frost ", "Fan "])

    name = makeNewSuffix(name, " (", " Cloak)", [" Plant", " Trash", " Sandy"])
    name = makeNewSuffix(name, " (", " Form)", [" Overcast", " Sunshine"])
    name = makeNewSuffix(name, " (", ")", [" Sunny", " Rainy", " Snowy"])

    name = checkNameInDict(name)

    return name
}

function checkNameInDict(str) {

    if (!!dictPok[str]) {
        return dictPok[str]
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

function movePrefixToSuffix(str, suffixStart, suffixEnd, arrOfTargets) {
    for (let i = 0; i < arrOfTargets.length; i++) {
        let index = str.indexOf(arrOfTargets[i])
        if (index !== -1) {
            str = str.slice(index + arrOfTargets[i].length)
            return `${str}${suffixStart}${arrOfTargets[i].slice(0, arrOfTargets[i].length - 1)}${suffixEnd}`
        }
    }
    return str
}

function makeNewSuffix(str, suffixStart, suffixEnd, arrOfTargets) {
    for (let i = 0; i < arrOfTargets.length; i++) {
        let index = str.indexOf(arrOfTargets[i])
        if (index !== -1) {
            str = str.slice(0, index)
            return `${str}${suffixStart}${arrOfTargets[i].slice(1)}${suffixEnd}`
        }
    }
    return str
}

export function translareMove(moveName) {
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


let dictPok = {
    "Oricorio (Pa&#039;u Style)": "Oricorio (Pa'u Style)",

    "Gastrodon (West)": "Gastrodon",
    "Gastrodon (East)": "Gastrodon",
    "Shellos (West)": "Shellos",
    "Shellos (East)": "Shellos",

    "Mewtwo (Armored)": "Armored Mewtwo",

    "Farfetch'd": "Farfetchd",

    "Burmy (Plant)": "Burmy (Plant Cloak)",
    "Burmy (Sandy)": "Burmy (Sandy Cloak)",
    "Burmy (Trash)": "Burmy (Trash Cloak)",
    "Wormadam (Trash)": "Wormadam (Trash Cloak)",
    "Wormadam (Plant)": "Wormadam (Plant Cloak)",
    "Wormadam (Sandy)": "Wormadam (Sandy Cloak)",

    "Deoxys Defense": "Deoxys (Defense Forme)",
    "Deoxys": "Deoxys (Normal Forme)",
    "Deoxys (Speed)": "Deoxys (Speed Forme)",
    "Deoxys (Defense)": "Deoxys (Defense Forme)",
    "Deoxys (Attack)": "Deoxys (Attack Forme)",

    "Darmanitan (Standard)": "Darmanitan",

    "Tornadus (Incarnate)": "Tornadus (Incarnate Forme)",
    "Giratina (Origin)": "Giratina (Origin Forme)",
    "Giratina (Altered)": "Giratina (Altered Forme)",
    "Landorus (Incarnate)": "Landorus (Incarnate Forme)",

    "Cherrim (Sunny)": "Cherrim (Sunshine Form)",
    "Cherrim (Overcast)": "Cherrim (Overcast Form)",

    "Thundurus (Incarnate)": "Thundurus (Incarnate Forme)",

    "Keldeo (Ordinary)": "Keldeo",

    "Mime (Jr)": "Mime Jr",

    "Shaymin (Land)": "Shaymin (Land Forme)",
    "Shaymin (Sky)": "Shaymin (Sky Forme)",

    "Tornadus (Therian)": "Tornadus (Therian Forme)",
    "Thundurus (Therian)": "Thundurus (Therian Forme)",
    "Landorus (Therian)": "Landorus (Therian Forme)",
    "Kyurem (Black)": "Black Kyurem",
    "Kyurem (White)": "White Kyurem",
    "Meloetta (Aria)": "Meloetta (Aria Forme)",
    "Meloetta (Pirouette)": "Meloetta (Pirouette Forme)",

    "Deerling_autumn": "Deerling (Autumn)",
    "Deerling_spring": "Deerling (Spring)",
    "Deerling_summer": "Deerling (Summer)",
    "Deerling_winter": "Deerling (Winter)",

    "Darmanitan (Zen)": "Darmanitan (Zen Mode)",
    "Darmanitan (Galarian Zen)": "Galarian Darmanitan (Zen Mode)",

    "Pikachu Libre": "Pikachu (Libre)",
    "Farfetch&#039;d": "Farfetchd",
    "Galarian Farfetch&#039;d": "Galarian Farfetchd",

    "Galarian Darmanitan - Zen Mode": "Galarian Darmanitan (Zen Mode)",
    "Thundurus  (Incarnate Forme)": "Thundurus (Incarnate Forme)",
    "Sirfetch&#039;d": "Sirfetchd",

    "Charizard (Mega X)": "Mega Charizard X",
    "Charizard (Mega Y)": "Mega Charizard Y",

    "Mewtwo (Mega X)": "Mega Mewtwo X",
    "Mewtwo (Mega Y)": "Mega Mewtwo Y",

    "gastrodon_west": "Gastrodon",
    "gastrodon_east": "Gastrodon",
    "shellos_west": "Shellos",
    "shellos_east": "Shellos",
    "mewtwo_armored": "Armored Mewtwo",
    "farfetch'd": "Farfetchd",
    "wormadam_trash": "Wormadam (Trash Cloak)",
    "wormadam_plant": "Wormadam (Plant Cloak)",
    "wormadam_sandy": "Wormadam (Plant Cloak)",
    "deoxys": "Deoxys (Normal Forme)",
    "darmanitan_standard": "Darmanitan",
    "deoxys_speed": "Deoxys (Speed Forme)",
    "tornadus_incarnate": "Tornadus (Incarnate Forme)",
    "giratina_origin": "Giratina (Origin Forme)",
    "giratina_altered": "Giratina (Altered Forme)",
    "landorus_incarnate": "Landorus (Incarnate Forme)",
    "cherrim_sunny": "Cherrim (Sunshine Form)",
    "cherrim_overcast": "Cherrim (Overcast Form)",
    "deoxys_defense": "Deoxys (Defense Forme)",
    "thundurus_incarnate": "Thundurus (Incarnate Forme)",
}


var dictMove = {
    "Mud-Slap": "Mud Slap",
    "Super Power": "Superpower",
    "Vice Grip": "Vise Grip",
    "X Scissor": "X-Scissor",
    "Lock On": "Lock-On",
    "Power Up Punch": "Power-Up Punch",
    "Hidden Power (Bug)": "Hidden Power Bug",
    "Hidden Power (Dark)": "Hidden Power Dark",
    "Hidden Power (Dragon)": "Hidden Power Dragon",
    "Hidden Power (Electric)": "Hidden Power Electric",
    "Hidden Power (Fighting)": "Hidden Power Fighting",
    "Hidden Power (Fire)": "Hidden Power Fire",
    "Hidden Power (Flying)": "Hidden Power Flying",
    "Hidden Power (Ghost)": "Hidden Power Ghost",
    "Hidden Power (Grass)": "Hidden Power Grass",
    "Hidden Power (Ground)": "Hidden Power Ground",
    "Hidden Power (Ice)": "Hidden Power Ice",
    "Hidden Power (Poison)": "Hidden Power Poison",
    "Hidden Power (Psychic)": "Hidden Power Psychic",
    "Hidden Power (Rock)": "Hidden Power Rock",
    "Hidden Power (Steel)": "Hidden Power Steel",
    "Hidden Power (Water)": "Hidden Power Water",

    "Weather Ball (Fire)": "Weather Ball Fire",
    "Weather Ball (Ice)": "Weather Ball Ice",
    "Weather Ball (Normal)": "Weather Ball",
    "Weather Ball (Rock)": "Weather Ball",
    "Weather Ball Rock": "Weather Ball",
    "Weather Ball (Water)": "Weather Ball Water",

    "Wrap Green": "Wrap (Green)",
    "Wrap Pink": "Wrap (Pink)",
    "Hydro Pump Blastoise": "Hydro Pump (Blastoise)",
    "Scald Blastoise": "Scald (Blastoise)",
    "Water Gun Fast Blastoise": "Water Gun (Blastoise)",
    "Water Gun Blastoise": "Water Gun (Blastoise)",
    "Futuresight": "Future Sight",

    "V Create": "V-Create",
}