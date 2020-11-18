import { levelData } from "js/bases/levelData";

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