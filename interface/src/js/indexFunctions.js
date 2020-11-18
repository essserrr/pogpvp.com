import { levelData } from "js/bases/levelData";
import { tierHP } from "js/bases/tierHP";
import { stagesData } from "js/bases/stagesData";

export const capitalizeFirst = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|-|["'([{])+\S/g, match => match.toUpperCase());



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

export function calculateCP(name, Lvl, Atk, Def, Sta, pokBase) {
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

export function calculateBossCP(name, tier, pokBase) {
    if (!name || !pokBase[name]) {
        return 0
    }
    return Math.trunc((15 + Number(pokBase[name].Atk)) * Math.pow(15 + Number(pokBase[name].Def), 0.5) *
        Math.pow(tierHP[tier], 0.5) / 10);
}

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
}

export function checkLvl(lvl) {
    let lvlNumber = Number(lvl)
    if (isNaN(lvlNumber)) {
        return 0
    }
    if (lvlNumber > 45) {
        return 45
    }
    if (lvlNumber < 0) {
        return 0
    }
    if (!Number.isInteger(lvlNumber / 0.5)) {
        return Math.trunc(lvlNumber)
    }
    return lvl
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

export function returnEffAtk(AtkIV, Atk, Lvl, isShadow) {
    return (Number(AtkIV) + Atk) * levelData[checkLvl(Lvl) / 0.5] * (isShadow === "true" ? 1.2 : 1)
}


export function calculateDamage(movePower, aAttack, dDefence, multiplier) {
    if (aAttack === 0 || dDefence === 0 || multiplier === 0) {
        return 0
    }
    return Math.trunc(movePower * 0.5 * (aAttack / dDefence) * multiplier + 1)
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

export function encodePveAttacker(data) {
    let res = [
        data.Name, data.QuickMove, data.ChargeMove,
        data.Lvl, data.Atk, data.Def, data.Sta,
        data.IsShadow,
    ]
    return encodeURIComponent(res.join("_"));
}

export function encodePveBoss(data) {
    let res = [data.Name, data.QuickMove, data.ChargeMove, data.Tier,]
    return encodeURIComponent(res.join("_"));
}

export function encodePveObj(data) {
    let res = [
        data.FriendshipStage, data.Weather, data.DodgeStrategy,
        data.PartySize, data.PlayersNumber, data.IsAggresive, data.SupportSlotEnabled
    ]
    return encodeURIComponent(res.join("_"));
}

export function pveattacker() {
    return {
        Name: "", QuickMove: "", ChargeMove: "",
        Lvl: "40", Atk: "15", Def: "15", Sta: "15",
        IsShadow: "false", quickMovePool: "", chargeMovePool: "",
    }
}

export function getUserPok() {
    return {
        Name: "", QuickMove: "", ChargeMove: "", ChargeMove2: "",
        Lvl: "40", Atk: "15", Def: "15", Sta: "15",
        IsShadow: "false", quickMovePool: "", chargeMovePool: "",
    }
}

export function boss() {
    return {
        Name: "", QuickMove: "", ChargeMove: "",
        Tier: "4", quickMovePool: "", chargeMovePool: "",
    }
}

export function pveobj() {
    return {
        FriendshipStage: "0", Weather: "0", DodgeStrategy: "0",
        PartySize: "18", PlayersNumber: "3", IsAggresive: "true", SupportSlotEnabled: "false",
    }
}

export function pveUserSettings() {
    return { FindInCollection: true, SortByDamage: "true", UserPlayers: [[pveCutomParty(), pveCutomParty(), pveCutomParty()],], }
}

export function pveCutomParty() {
    return { title: "", party: [] }
}


export function pokemon() {
    return {
        name: "", Lvl: "", Atk: "", Def: "", Sta: "", Shields: "0",
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