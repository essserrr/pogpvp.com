import React from "react";
import PokemonIconer from "../App/PvP/components/PokemonIconer/PokemonIconer"

export const capitalizeFirst = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|[""([{])+\S/g, match => match.toUpperCase());

export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, "\\$1") + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function checkShadow(name, pokTable) {
    if (!pokTable[name]) {
        let index = name.indexOf(" (Shadow)")
        if (index !== -1) {
            name = name.slice(0, index)
            if (!pokTable[name]) {
                console.log("Not found " + name)
                return ""
            }
        }
    }
    return name
}

export function returnMovePool(name, pokTable, locale, isBoss, additionalQ, addtionalCh) {
    if (pokTable[name] === undefined || name === "") {
        return { quickMovePool: [], chargeMovePool: [] }
    }
    //make array of moves
    let quickRaw = [...pokTable[name].QuickMoves];
    let chargeRaw = [...pokTable[name].ChargeMoves];
    //filter empty values and elite moves for boses
    let quickFiltered = quickRaw.filter((elem) => {
        if (isBoss) {
            switch (pokTable[name].EliteMoves[elem]) {
                case 1:
                    return false
                default:
                    return elem !== ""
            }
        }
        return elem !== "";
    });
    let chargeFiltered = chargeRaw.filter((elem) => {
        if (isBoss) {
            switch (pokTable[name].EliteMoves[elem]) {
                case 1:
                    return false
                default:
                    return elem !== ""
            }
        }
        return elem !== "";
    });
    //make options array
    let quickMovePool = quickFiltered.map((moveName) => {
        return <option value={moveName} key={moveName}>{moveName + (pokTable[name].EliteMoves[moveName] === 1 ? "*" : "")}</option>;
    });
    pushAdditional(additionalQ, quickFiltered, quickMovePool)
    quickMovePool.unshift(<option value={""} key={""}>{locale.none}</option>)
    quickMovePool.push(<option value={"Select..."} key={"Select..."}>{locale.select}</option>)

    let chargeMovePool = chargeFiltered.map((moveName) => {
        return <option value={moveName} key={moveName}>{moveName + (pokTable[name].EliteMoves[moveName] === 1 ? "*" : "")}</option>;
    });
    pushAdditional(addtionalCh, chargeFiltered, chargeMovePool)
    chargeMovePool.unshift(<option value={""} key={""}>{locale.none}</option>)
    chargeMovePool.push(<option value={"Select..."} key={"Select..."}>{locale.select}</option>)

    return { quickMovePool, chargeMovePool }
}

function pushAdditional(additional, set, target) {
    if (!additional || !set || !target) {
        return
    }
    //iterate over additional moves
    additional.forEach((item, i) => {
        //if addirional move is invalid somehow  - continue
        if (!item) { return }
        if (!set.includes(item)) {
            target.push(<option value={item} key={item}>{item + "*"}</option>)
        }
    });
}

export function calculateMaximizedStats(name, lvlCap, pokTable, options) {
    if (pokTable[name] === undefined) {
        return [];
    }

    let legendaries = ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Regirock",
        "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Dialga", "Palkia", "Heatran", "Regigigas",
        "Giratina (Altered Forme)", "Giratina (Origin Forme)", "Cresselia", "Cobalion", "Terrakion", "Virizion",
        "Thundurus (Incarnate Forme)", "Thundurus (Therian Forme)", "Tornadus (Incarnate Forme)", "Tornadus (Therian Forme)",
        "Landorus (Incarnate Forme)", "Landorus (Therian Forme)", "Reshiram", "Zekrom", "Kyurem", "Black Kyurem", "White Kyurem",
        "Armored Mewtwo"]

    let untradable = ["Mew", "Celebi", "Deoxys (Attack Forme)", "Deoxys (Defense Forme)", "Deoxys (Speed Forme)",
        "Deoxys (Normal Forme)", "Jirachi", "Darkrai"]

    let fieldResearched = ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Regirock",
        "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Mew", "Celebi", "Jirachi", "Groudon", "Cresselia", "Regigigas"]

    let minIV = 0
    let minLvl = 1
    switch (true) {
        case untradable.includes(name):
            minIV = 10
            switch (fieldResearched.includes(name)) {
                case true:
                    minLvl = 20
                    break
                default:
                    minLvl = 15
            }
            break
        case legendaries.includes(name):
            minIV = 1
            minLvl = 20
            switch (fieldResearched.includes(name)) {
                case true:
                    minLvl = 20
                    break
                default:
                    minLvl = 15
            }
            break
        default:
    }
    //if options obj is missing, or object league=true
    if (!options || options.great) {
        let sheetGreat = generateIVSpreadSheet(pokTable[name], 1500, minIV, lvlCap, minLvl)
        var great = generateMaximized(sheetGreat)
    }
    if (!options || options.ultra) {
        let sheetUltra = generateIVSpreadSheet(pokTable[name], 2500, minIV, lvlCap, minLvl)
        var ultra = generateMaximized(sheetUltra)
    }
    if (!options || options.master) {
        let sheetMaster = generateIVSpreadSheet(pokTable[name], 9999, minIV, lvlCap, minLvl)
        var master = generateMaximized(sheetMaster)
    }
    return { great, ultra, master }
}

//generates spread sheet of pok's stats
function generateIVSpreadSheet(pok, cpCap, minIV, lvlCap, minLvl) {
    let pokIVSpreadSheet = [];
    let maxA = {}
    let maxD = {}

    for (let cIV = 15.0; cIV >= minIV; cIV--) {
        for (let dIV = 15.0; dIV >= minIV; dIV--) {
            for (let aIV = 15.0; aIV >= minIV; aIV--) {
                for (let level = lvlCap; level >= minLvl ? minLvl : 1; level -= 0.5) {
                    //calculate cp every iteration
                    let levelMultiplier = levelData[level / 0.5]
                    let cpAtLvl = Math.trunc(((aIV + Number(pok.Atk)) * Math.pow((dIV + Number(pok.Def)), 0.5) *
                        Math.pow((cIV + Number(pok.Sta)), 0.5) * Math.pow(levelMultiplier, 2)) / 10);

                    //if cp is bigger than max, skip calculations
                    if (cpAtLvl > cpCap) {
                        if ((cpAtLvl - cpCap) > 800) {
                            level -= 2
                            continue
                        }
                        if ((cpAtLvl - cpCap) > 400) {
                            level -= 1
                            continue
                        }
                        if ((cpAtLvl - cpCap) > 200) {
                            level -= 0.5
                            continue
                        }
                        continue
                    }

                    //calculate effective stats
                    let efA = levelMultiplier * (aIV + pok.Atk);
                    let efD = levelMultiplier * (dIV + pok.Def);
                    let efS = Math.trunc(levelMultiplier * (cIV + pok.Sta));
                    let statProd = efA * efD * efS


                    if (compareStats(maxA.efA, efA, maxA.StatProduct, statProd)) {
                        maxA = {
                            StatProduct: statProd, Level: level,
                            Atk: aIV, Def: dIV, Sta: cIV,
                            efA: efA, efD: efD, efS: efS,
                        }
                    }

                    if (compareStats(maxD.efD, efD, maxD.StatProduct, statProd)) {
                        maxD = {
                            StatProduct: statProd, Level: level,
                            Atk: aIV, Def: dIV, Sta: cIV,
                            efA: efA, efD: efD, efS: efS,
                        }
                    }

                    pokIVSpreadSheet.push({
                        StatProduct: statProd, Level: level,
                        Atk: aIV, Def: dIV, Sta: cIV,
                        efA: efA, efD: efD, efS: efS,
                    })
                    break
                }
            }
        }
    };
    pokIVSpreadSheet.sort((a, b) => {
        if (a.StatProduct === b.StatProduct) {
            return (b.Atk + b.Def + b.Sta) - (a.Atk + a.Def + a.Sta)
        }
        return b.StatProduct - a.StatProduct
    });
    return { maxCom: pokIVSpreadSheet, maxA: maxA, maxD: maxD, }
}

function compareStats(statA, statB, statProdA, statProdB) {
    if (statA === statB) {
        if (statProdA === statProdB) { return false }
        if (statProdA > statProdB) { return false }
        return true
    }
    if (statA >= statB) { return false }
    return true
}



//selects Max overall, max attack and max defence results from spreadsheet. Generates default iv's as well
function generateMaximized(sheet) {
    return {
        Overall: {
            Level: String(sheet.maxCom[0].Level),
            Atk: String(sheet.maxCom[0].Atk), Def: String(sheet.maxCom[0].Def), Sta: String(sheet.maxCom[0].Sta),
        },
        Atk: {
            Level: String(sheet.maxA.Level),
            Atk: String(sheet.maxA.Atk), Def: String(sheet.maxA.Def), Sta: String(sheet.maxA.Sta),
        },
        Def: {
            Level: String(sheet.maxD.Level),
            Atk: String(sheet.maxD.Atk), Def: String(sheet.maxD.Def), Sta: String(sheet.maxD.Sta),
        },
        Default: {
            Level: String(sheet.maxCom[99].Level),
            Atk: String(sheet.maxCom[99].Atk), Def: String(sheet.maxCom[99].Def), Sta: String(sheet.maxCom[99].Sta),
        }
    }
}

export function culculateCP(name, Lvl, Atk, Def, Sta, pokBase) {
    if (!name || !pokBase[name]) {
        return 0
    }
    let cpAtLvl = Math.trunc(((checkIV(Atk) + Number(pokBase[name].Atk)) * Math.pow((checkIV(Def) + Number(pokBase[name].Def)), 0.5) *
        Math.pow((checkIV(Sta) + Number(pokBase[name].Sta)), 0.5) * Math.pow(levelData[checkLvl(Lvl) / 0.5], 2)) / 10)
    if (cpAtLvl < 10) {
        cpAtLvl = 10
    }
    return cpAtLvl
}

export function culculateBossCP(name, tier, pokBase) {
    if (!name || !pokBase[name]) {
        return 0
    }
    return Math.trunc((15 + Number(pokBase[name].Atk)) * Math.pow(15 + Number(pokBase[name].Def), 0.5) *
        Math.pow(tierHP[tier], 0.5) / 10);
}

export function checkIV(IV) {
    if (isNaN(IV)) {
        return ""
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
}

export function checkLvl(lvl) {
    if (isNaN(lvl)) {
        return ""
    }
    lvl = Number(lvl)
    if (lvl > 45) {
        return 45
    }
    if (lvl < 1) {
        return ""
    }
    if (!Number.isInteger(lvl / 0.5)) {
        return Math.trunc(lvl)
    }
    return String(lvl)
}

export function calculateEffStat(name, lvl, value, stage, pokBase, what, isShadow) {
    if (!name || !pokBase[name]) {
        return 0
    };
    let stageMultiplier = (what !== "Sta" ? stagesData[stage] : 1)
    let shadowMultipler = (isShadow === "true" ? (what === "Atk" ? 1.2 : 0.833) : 1)

    let effValue = (checkIV(value) + Number(pokBase[name][what])) * levelData[checkLvl(lvl) / 0.5] * stageMultiplier * shadowMultipler
    return what !== "Sta" ? Math.round(effValue * 10) / 10 : Math.trunc(effValue)
}

export function processHP(HP) {
    if (Number(HP) < 0) {
        return 0
    }
    return HP
}

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

export function getRoundFromString(string) {
    let extractedNumber = parseInt(string, 10)
    if (extractedNumber) {
        return extractedNumber
    }
    return ""
}

export function calculateMultiplier(aTypes, dTypes, mType) {
    if (!aTypes || !dTypes) {
        return 0
    }
    const pvpMultiplier = 1.3
    let stabBonus = (aTypes.includes(mType) ? 1.2 : 1)
    let moveEfficiency = effectivenessData[mType]
    let seMultiplier = 1

    dTypes.forEach((elem) => {
        if (moveEfficiency[elem] !== 0) {
            seMultiplier *= moveEfficiency[elem]
        }
    });
    return pvpMultiplier * seMultiplier * stabBonus
}

export function returnEffAtk(AtkIV, Atk, Lvl, isShadow) {
    return (Number(AtkIV) + Atk) * levelData[checkLvl(Lvl) / 0.5] * (isShadow === "true" ? 1.2 : 1)
}


export function calculateDamage(movePower, aAttack, dDefence, multiplier) {
    if (aAttack === 0 || dDefence === 0 || multiplier === 0) {
        return 0
    }
    return Math.trunc(movePower * 0.5 * (aAttack / dDefence) * multiplier + 1)
}

export function getPveMultiplier(aTypes, dTypes, mType, weatherType, friendStage) {
    let stabBonus = (aTypes.includes(mType) ? 1.2 : 1)
    let moveEfficiency = effectivenessData[mType]
    let seMultiplier = 1

    dTypes.forEach((elem) => {
        if (moveEfficiency[elem] !== 0) {
            seMultiplier *= moveEfficiency[elem]
        }
    });
    let weatherMul = 1
    if (weather[weatherType][mType]) {
        weatherMul = weather[weatherType][mType]
    }
    return stabBonus * friendship[friendStage] * seMultiplier * weatherMul
}





export function encodeQueryData(data) {
    let res = [
        data.Shields,
        data.Lvl, data.Atk, data.Def, data.Sta, data.name,
        data.AtkStage, data.DefStage, data.InitialHP, data.InitialEnergy, data.IsGreedy, data.IsShadow,
        data.QuickMove, data.ChargeMove1, data.ChargeMove2,
    ]
    return encodeURIComponent(res.join("_"));
}

export function extractName(name) {
    let splitted = name.split(" ")

    if (splitted.length === 1) {
        return { Name: name, Additional: "" }
    }
    if (splitted[0] === "Galarian" || splitted[0] === "Alolan" || splitted[0] === "Black" || splitted[0] === "White" ||
        splitted[0] === "Armored" || splitted[0] === "Mega") {
        return {
            Name: splitted[1],
            Additional: splitted[0] + ((splitted.length > 2) ? ", " + splitted.slice(2).join(" ").replace(/[()]/g, "") : "")
        }
    }
    console.log(splitted)
    return { Name: splitted[0], Additional: splitted.slice(1).join(" ").replace(/[()]/g, "") }
}

export function extractData(league, pok1, pok2) {
    let attacker = decodeURIComponent(pok1).split("_")
    let defender = decodeURIComponent(pok2).split("_")
    return {
        attacker: (attacker.length === 15) ? attacker : undefined,
        defender: (defender.length === 15) ? defender : undefined,
        league: (league === "great" || league === "ultra" || league === "master") ? league : undefined
    }
}

export function extractRaidData(attacker, boss, obj) {
    let attackerObj = decodeURIComponent(attacker).split("_")
    let bossObj = decodeURIComponent(boss).split("_")
    let pveObj = decodeURIComponent(obj).split("_")
    return {
        attackerObj: (attackerObj.length === 8) ? attackerObj : undefined,
        bossObj: (bossObj.length === 4) ? bossObj : undefined,
        pveObj: (pveObj.length === 6) ? pveObj : undefined,
    }
}

export function extractPveAttacker(array) {
    return {
        Name: array[0], QuickMove: array[1], ChargeMove: array[2],
        Lvl: array[3], Atk: array[4], Def: array[5], Sta: array[6],
        IsShadow: array[7], quickMovePool: "", chargeMovePool: "",
    }
}

export function encodePveAttacker(data) {
    let res = [
        data.Name, data.QuickMove, data.ChargeMove,
        data.Lvl, data.Atk, data.Def, data.Sta,
        data.IsShadow,
    ]
    return encodeURIComponent(res.join("_"));
}

export function extractPveBoss(array) {
    return {
        Name: array[0], QuickMove: array[1], ChargeMove: array[2],
        Tier: array[3], quickMovePool: "", chargeMovePool: "",
    }
}

export function encodePveBoss(data) {
    let res = [
        data.Name, data.QuickMove, data.ChargeMove, data.Tier,
    ]
    return encodeURIComponent(res.join("_"));
}


export function extractPveObj(array) {
    return {
        FriendshipStage: array[0],
        Weather: array[1],
        DodgeStrategy: array[2],

        PartySize: array[3],
        PlayersNumber: array[4],
        IsAggresive: array[5],
    }
}

export function encodePveObj(data) {
    let res = [
        data.FriendshipStage, data.Weather, data.DodgeStrategy,
        data.PartySize, data.PlayersNumber, data.IsAggresive,
    ]
    return encodeURIComponent(res.join("_"));
}

export function pveattacker() {
    return {
        Name: "", QuickMove: "", ChargeMove: "",
        Lvl: "35", Atk: "15", Def: "15", Sta: "15",
        IsShadow: "false", quickMovePool: "", chargeMovePool: "",
    }
}

export function boss(locale) {
    return {
        Name: locale, QuickMove: "", ChargeMove: "",
        Tier: "4", quickMovePool: "", chargeMovePool: "",
    }
}

export function pveobj() {
    return {
        FriendshipStage: "0", Weather: "0", DodgeStrategy: "0",
        PartySize: "18", PlayersNumber: "3", IsAggresive: "false",
    }
}

export function returnPokList(pokBase, addNone, locale) {
    let pokList = [];
    if (addNone) {
        pokList.push({
            value: locale,
            label: <div style={{ textAlign: "left" }} >{locale}</div>,
        });
    }
    //create pokemons list
    for (const [key, value] of Object.entries(pokBase)) {
        pokList.push({
            value: key,
            label: <div style={{ textAlign: "left" }}>
                <PokemonIconer
                    src={value.Number + (value.Forme !== "" ? "-" + value.Forme : "")}
                    class={"icon24 mr-1"}
                />{key}
            </div>,
        });
    }
    return pokList
}

export function separateMovebase(movebase) {
    let chargeMoveList = [];
    let quickMoveList = [];
    //create pokemons list

    for (const [key, value] of Object.entries(movebase)) {
        switch (value.MoveCategory) {
            case "Charge Move":
                chargeMoveList.push({
                    value: key,
                    label: key,
                });
                break
            case "Fast Move":
                quickMoveList.push({
                    value: key,
                    label: key,
                });
                break
            default:
        }
    }
    return { chargeMoveList: chargeMoveList, quickMoveList: quickMoveList }
}


export function extractPokemon(array) {
    return {
        name: array[5], Lvl: array[1], Atk: array[2], Def: array[3], Sta: array[4], Shields: array[0],
        AtkStage: array[6], DefStage: array[7], InitialHP: array[8], InitialEnergy: array[9], IsGreedy: array[10], IsShadow: array[11],
        QuickMove: array[12], ChargeMove1: array[13], ChargeMove2: array[14],
        quickMovePool: "", chargeMovePool: "",
        effAtk: "", effDef: "", effSta: "",
        maximizer: {
            stat: "Overall",
            level: "40",
            action: "Default",
        },
        HP: undefined, Energy: undefined,
    }
}
export function pokemon(locale) {
    return {
        name: locale, Lvl: "", Atk: "", Def: "", Sta: "", Shields: "0",
        AtkStage: "0", DefStage: "0", InitialHP: "0", InitialEnergy: "0", IsGreedy: "true", IsShadow: "false",
        QuickMove: "", ChargeMove1: "", ChargeMove2: "",
        quickMovePool: "", chargeMovePool: "",
        effAtk: "", effDef: "", effSta: "",
        maximizer: {
            stat: "Overall",
            level: "40",
            action: "Default",
        },
        HP: undefined, Energy: undefined, showMenu: false,
    }
}


export function selectQuick(movelist, moveTable, pokName, pokTable) {
    let bestScore = 0
    let bestName = ""
    //for every move
    movelist.forEach(function (move) {
        //exept select option
        if (move.key === "Select..." || move.key === "") {
            return
        }
        let duration = moveTable[move.key].PvpDurationSeconds
        let damage = moveTable[move.key].PvpDamage
        let energy = moveTable[move.key].PvpEnergy
        //define stab
        let stab = (pokTable[pokName].Type.includes(moveTable[move.key].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = Math.pow(((damage * stab) / duration) * Math.pow(energy / duration, 1.9), 1 / 2)
        if (score > bestScore) {
            bestScore = score
            bestName = moveTable[move.key].Title
        }
    });
    return bestName
}

export function selectCharge(movelist, moveTable, pokName, pokTable) {
    let primaryName = ""
    let bestScore = 0
    let bestEnergy = 0
    let primaryType = ""
    //define primary move
    //for every move
    movelist.forEach((move) => {
        //exept select option
        if (move.key === "Select..." || move.key === "") {
            return
        }
        //filter self-harm moves
        if (moveTable[move.key].StageDelta < 0 && moveTable[move.key].Subject === "Self") {
            return
        }
        let damage = moveTable[move.key].PvpDamage
        let energy = -moveTable[move.key].PvpEnergy
        let stab = (pokTable[pokName].Type.includes(moveTable[move.key].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = stab * damage / Math.pow(energy, 2)
        switch (true) {
            case score > bestScore:
                bestScore = score
                bestEnergy = energy
                primaryName = moveTable[move.key].Title
                primaryType = moveTable[move.key].MoveType
                break
            case score === bestScore:
                if (energy < bestEnergy) {
                    bestScore = score
                    bestEnergy = energy
                    primaryName = moveTable[move.key].Title
                    primaryType = moveTable[move.key].MoveType
                }
                break
            default:
        }
    })

    //define secondary move
    //for every move
    bestEnergy = 0
    bestScore = 0
    let secodaryName = ""
    let secondaryType = ""

    movelist.forEach((move) => {
        //exept select option and primary move
        if (move.key === "Select..." || move.key === "" || move.key === primaryName) {
            return
        }
        let damage = moveTable[move.key].PvpDamage
        let energy = -moveTable[move.key].PvpEnergy
        let stab = (pokTable[pokName].Type.includes(moveTable[move.key].MoveType) ? 1.2 : 1)
        //and calculate score
        let score = stab * damage / Math.pow(energy, 2)

        switch (true) {
            case score > bestScore:
                bestScore = score
                bestEnergy = energy
                secodaryName = moveTable[move.key].Title
                secondaryType = moveTable[move.key].MoveType
                break
            case score === bestScore:
                if (energy < bestEnergy) {
                    bestScore = score
                    bestEnergy = energy
                    secodaryName = moveTable[move.key].Title
                    secondaryType = moveTable[move.key].MoveType
                }
                break
            case primaryType === secondaryType:
                if (primaryType !== moveTable[move.key].MoveType) {
                    bestScore = score
                    bestEnergy = energy
                    secodaryName = moveTable[move.key].Title
                    secondaryType = moveTable[move.key].MoveType
                }
                break
            default:
        }
    })



    return { primaryName, secodaryName }
}

export function returnRateStyle(rate) {
    if (rate >= 630) {
        return ["+2", "R4"]
    }
    if (rate > 500) {
        return ["+1", "R3"]
    }
    if (rate === 500) {
        return ["0", "R0"]
    }
    if (rate >= 370) {
        return ["-1", "R1"]
    }
    return ["-2", "R2"]
}

export function returnVunStyle(rate) {
    if (rate > 1.600) {
        return "R2"
    }
    if (rate > 1.000) {
        return "R1"
    }
    if (rate === "1.000") {
        return "R0"
    }
    if (rate > 0.391) {
        return "R3"
    }
    return "R4"
}

export var levelData = [
    0,
    0,
    0.094,
    0.1351374318,
    0.16639787,
    0.192650919,
    0.21573247,
    0.2365726613,
    0.25572005,
    0.2735303812,
    0.29024988,
    0.3060573775,
    0.3210876,
    0.3354450362,
    0.34921268,
    0.3624577511,
    0.3752356,
    0.387592416,
    0.39956728,
    0.4111935514,
    0.4225,
    0.4329264091,
    0.44310755,
    0.4530599591,
    0.4627984,
    0.472336093,
    0.48168495,
    0.4908558003,
    0.49985844,
    0.508701765,
    0.51739395,
    0.5259425113,
    0.5343543,
    0.5426357375,
    0.5507927,
    0.5588305862,
    0.5667545,
    0.5745691333,
    0.5822789,
    0.5898879072,
    0.5974,
    0.6048236651,
    0.6121573,
    0.6194041216,
    0.6265671,
    0.6336491432,
    0.64065295,
    0.6475809666,
    0.65443563,
    0.6612192524,
    0.667934,
    0.6745818959,
    0.6811649,
    0.6876849038,
    0.69414365,
    0.70054287,
    0.7068842,
    0.7131691091,
    0.7193991,
    0.7255756136,
    0.7317,
    0.7347410093,
    0.7377695,
    0.7407855938,
    0.74378943,
    0.7467812109,
    0.74976104,
    0.7527290867,
    0.7556855,
    0.7586303683,
    0.76156384,
    0.7644860647,
    0.76739717,
    0.7702972656,
    0.7731865,
    0.7760649616,
    0.77893275,
    0.7817900548,
    0.784637,
    0.7874736075,
    0.7903,
    0.79280394673147,
    0.79530001,
    0.7978039219965,
    0.8003,
    0.80280389261637,
    0.8053,
    0.8078038635071,
    0.81029999,
    0.81280383472521,
    0.81529999
]

export var typeDecoder = [
    "Bug",
    "Dark",
    "Dragon",
    "Electric",
    "Fairy",
    "Fighting",
    "Fire",
    "Flying",
    "Ghost",
    "Grass",
    "Ground",
    "Ice",
    "Normal",
    "Poison",
    "Psychic",
    "Rock",
    "Steel",
    "Water",
]

export var weatherDecoder = [
    "2",
    "7",
    "5",
    "2",
    "4",
    "4",
    "1",
    "5",
    "7",
    "1",
    "1",
    "6",
    "3",
    "4",
    "5",
    "3",
    "6",
    "2",
]

export var typeEncoder = {
    "Bug": 0,
    "Dark": 1,
    "Dragon": 2,
    "Electric": 3,
    "Fairy": 4,
    "Fighting": 5,
    "Fire": 6,
    "Flying": 7,
    "Ghost": 8,
    "Grass": 9,
    "Ground": 10,
    "Ice": 11,
    "Normal": 12,
    "Poison": 13,
    "Psychic": 14,
    "Rock": 15,
    "Steel": 16,
    "Water": 17,
}

var stagesData = {
    "-4": 0.5,
    "-3": 0.57,
    "-2": 0.67,
    "-1": 0.8,
    "0": 1,
    "1": 1.25,
    "2": 1.5,
    "3": 1.75,
    "4": 2,
}

export var effectivenessData = [
    [
        0,
        1.6,
        0,
        0,
        0.625,
        0.625,
        0.625,
        0.625,
        0.625,
        1.6,
        0,
        0,
        0,
        0.625,
        1.6,
        0,
        0.625,
        0
    ],
    [
        0,
        0.625,
        0,
        0,
        0.625,
        0.625,
        0,
        0,
        1.6,
        0,
        0,
        0,
        0,
        0,
        1.6,
        0,
        0,
        0
    ],
    [
        0,
        0,
        1.6,
        0,
        0.391,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0.625,
        0
    ],
    [
        0,
        0,
        0.625,
        0.625,
        0,
        0,
        0,
        1.6,
        0,
        0.625,
        0.391,
        0,
        0,
        0,
        0,
        0,
        0,
        1.6
    ],
    [
        0,
        1.6,
        1.6,
        0,
        0,
        1.6,
        0.625,
        0,
        0,
        0,
        0,
        0,
        0,
        0.625,
        0,
        0,
        0.625,
        0
    ],
    [
        0.625,
        1.6,
        0,
        0,
        0.625,
        0,
        0,
        0.625,
        0.391,
        0,
        0,
        1.6,
        1.6,
        0.625,
        0.625,
        1.6,
        1.6,
        0
    ],
    [
        1.6,
        0,
        0.625,
        0,
        0,
        0,
        0.625,
        0,
        0,
        1.6,
        0,
        1.6,
        0,
        0,
        0,
        0.625,
        1.6,
        0.625
    ],
    [
        1.6,
        0,
        0,
        0.625,
        0,
        1.6,
        0,
        0,
        0,
        1.6,
        0,
        0,
        0,
        0,
        0,
        0.625,
        0.62,
        0
    ],
    [
        0,
        0.625,
        0,
        0,
        0,
        0,
        0,
        0,
        1.6,
        0,
        0,
        0,
        0.391,
        0,
        1.6,
        0,
        0,
        0
    ],
    [
        0.625,
        0,
        0.625,
        0,
        0,
        0,
        0.625,
        0.625,
        0,
        0.625,
        1.6,
        0,
        0,
        0.625,
        0,
        1.6,
        0.625,
        1.6
    ],
    [
        0.625,
        0,
        0,
        1.6,
        0,
        0,
        1.6,
        0.391,
        0,
        0.625,
        0,
        0,
        0,
        1.6,
        0,
        1.6,
        1.6,
        0
    ],
    [
        0,
        0,
        1.6,
        0,
        0,
        0,
        0.625,
        1.6,
        0,
        1.6,
        1.6,
        0.625,
        0,
        0,
        0,
        0,
        0.625,
        0.625
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0.391,
        0,
        0,
        0,
        0,
        0,
        0,
        0.625,
        0.625,
        0
    ],
    [
        0,
        0,
        0,
        0,
        1.6,
        0,
        0,
        0,
        0.625,
        1.6,
        0.625,
        0,
        0,
        0.625,
        0,
        0.625,
        0.391,
        0
    ],
    [
        0,
        0.391,
        0,
        0,
        0,
        1.6,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1.6,
        0.625,
        0,
        0.625,
        0
    ],
    [
        1.6,
        0,
        0,
        0,
        0,
        0.625,
        1.6,
        1.6,
        0,
        0,
        0.625,
        1.6,
        0,
        0,
        0,
        0,
        0.625,
        0
    ],
    [
        0,
        0,
        0,
        0.625,
        1.6,
        0,
        0.625,
        0,
        0,
        0,
        0,
        1.6,
        0,
        0,
        0,
        1.6,
        0.625,
        0.625
    ],
    [
        0,
        0,
        0.625,
        0,
        0,
        0,
        1.6,
        0,
        0,
        0.625,
        1.6,
        0,
        0,
        0,
        0,
        1.6,
        0,
        0.625
    ]
]

export var tierHP = [
    600,
    1800,
    3600,
    9000,
    15000,
    22500,
]

export var tierMult = [
    0.5974,
    0.67,
    0.73,
    0.79,
    0.79,
    0.79,
]

export var weather = {
    0: {},
    1: {
        10: 1.2,
        9: 1.2,
        6: 1.2,
    },
    2: {
        0: 1.2,
        3: 1.2,
        17: 1.2,
    },
    3: {
        15: 1.2,
        12: 1.2,
    },
    4: {
        13: 1.2,
        4: 1.2,
        5: 1.2,
    },
    5: {
        14: 1.2,
        7: 1.2,
        2: 1.2,
    },
    6: {
        16: 1.2,
        11: 1.2,
    },
    7: {
        8: 1.2,
        1: 1.2,
    },
}

var friendship = [
    1.0,
    1.03,
    1.05,
    1.07,
    1.1,
    1.06,
    1.12,
    1.18,
    1.25,
]

export const regionals = {
    "Farfetchd": 3,
    "Kangaskhan": 4,
    "Mr. Mime": 5,
    "Tauros": 6,

    "Heracross": 7,
    "Corsola": 17,

    "Volbeat": 1,
    "Illumise": 2,
    "Torkoal": 16,
    "Zangoose": 1,
    "Seviper": 2,
    "Lunatone": 1,
    "Solrock": 2,
    "Tropius": 15,
    "Relicanth": 18,

    "Pachirisu": 19,
    "Shellos": 12,
    "Mime Jr.": 5,
    "Chatot": 9,
    "Carnivine": 14,
    "Uxie": 13,
    "Mesprit": 8,
    "Azelf": 10,

    "Pansage": 13,
    "Pansear": 8,
    "Panpour": 10,
    "Throh": 2,
    "Sawk": 1,
    "Basculin": 12,
    "Maractus": 7,
    "Sigilyph": 11,
    "Heatmor": 2,
    "Durant": 1,
}