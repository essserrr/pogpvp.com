import React from 'react';
import PokemonIconer from "../App/PvP/components/PokemonIconer/PokemonIconer"

export const capitalizeFirst = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function checkShadow(name, pokemonTable) {
    var pokName = name
    if (!pokemonTable[pokName]) {
        var index = pokName.indexOf(" (Shadow)")
        if (index !== -1) {
            pokName = pokName.slice(0, index)
            if (!pokemonTable[pokName]) {
                console.log("Not found " + pokName)
            }
        }
    }
    return pokName
}

//returns move pool of select elements. Inputs are: role (string) and data (object with pok data), output: quick and charge move pool <option>
export function returnMovePool(name, data, locale, isBoss, additionalQ, addtionalCh) {
    if (data[name] === undefined || name === "") {
        return ({ quickMovePool: [], chargeMovePool: [] });
    }
    //make array of moves
    let quickRaw = [...data[name].QuickMoves];
    let chargeRaw = [...data[name].ChargeMoves];
    //filter empty values
    var quickFiltered = quickRaw.filter(function (e) {
        if (isBoss) {
            switch (data[name].EliteMoves[e]) {
                case 1:
                    return false
                default:
                    return e !== ""
            }
        }
        return e !== "";
    });
    var chargeFiltered = chargeRaw.filter(function (e) {
        if (isBoss) {
            switch (data[name].EliteMoves[e]) {
                case 1:
                    return false
                default:
                    return e !== ""
            }
        }
        return e !== "";
    });
    //make options tag array
    var quickMovePool = quickFiltered.map(function (moveName) {
        return <option value={moveName} key={moveName}>{moveName + (data[name].EliteMoves[moveName] === 1 ? "*" : "")}</option>;
    });
    pushAdditional(additionalQ, quickFiltered, quickMovePool)
    quickMovePool.unshift(<option value={""} key={""}>{locale.none}</option>)
    quickMovePool.push(<option value={"Select..."} key={"Select..."}>{locale.select}</option>)

    var chargeMovePool = chargeFiltered.map(function (moveName) {
        return <option value={moveName} key={moveName}>{moveName + (data[name].EliteMoves[moveName] === 1 ? "*" : "")}</option>;
    });
    pushAdditional(addtionalCh, chargeFiltered, chargeMovePool)
    chargeMovePool.unshift(<option value={""} key={""}>{locale.none}</option>)
    chargeMovePool.push(<option value={"Select..."} key={"Select..."}>{locale.select}</option>)

    return ({ quickMovePool, chargeMovePool })
}

function pushAdditional(additional, set, target) {
    if (!additional || !set || !target) {
        return
    }
    for (let i = 0; i < additional.length; i++) {
        if (!additional[i]) {
            continue
        }
        let isInMovepool = false
        for (let j = 0; j < set.length; j++) {
            if (additional[i] === set[j]) {
                isInMovepool = true
                break
            }
        }
        if (!isInMovepool) {
            target.push(<option value={additional[i]} key={additional[i]}>{additional[i] + "*"}</option>)
        }
    }
}

//Takes pok name, lvlCap and database, returns great, ultra and master leagues iv for given pok
export function calculateMaximizedStats(name, lvlCap, data, options) {
    if (data[name] === undefined) {
        return [];
    }

    var legendaries = ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Regirock",
        "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Dialga", "Palkia", "Heatran", "Regigigas",
        "Uxie", "Mesprit", "Azelf", "Giratina (Altered Forme)", "Giratina (Origin Forme)", "Cresselia", "Cobalion", "Terrakion",
        "Virizion", "Thundurus (Incarnate Forme)", "Thundurus (Therian Forme)", "Tornadus (Incarnate Forme)",
        "Tornadus (Therian Forme)", "Landorus (Incarnate Forme)", "Landorus (Therian Forme)", "Reshiram", "Zekrom", "Kyurem",
        "Black Kyurem", "White Kyurem", "Armored Mewtwo"
    ]
    var untradable = ["Mew", "Celebi", "Deoxys (Attack Forme)", "Deoxys (Defense Forme)", "Deoxys (Speed Forme)",
        "Deoxys (Normal Forme)", "Jirachi", "Darkrai"]

    var fieldResearched = ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Regirock",
        "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Mew", "Celebi", "Jirachi", "Groudon", "Cresselia", "Regigigas"]

    var isUntradable = (untradable.indexOf(name) > -1);
    var isLegendary = (legendaries.indexOf(name) > -1);
    var isFromResearch = (fieldResearched.indexOf(name) > -1);

    var minIV = 0
    var minLvl = 1
    switch (true) {
        case isUntradable:
            minIV = 10
            minLvl = 20
            if (isFromResearch) {
                minLvl = 15
            }
            break
        case isLegendary:
            minIV = 1
            minLvl = 20
            if (isFromResearch) {
                minLvl = 15
            }
            break
        default:
            break

    }
    if (name === "Uxie" || name === "Mesprit" || name === "Azelf") {
        minLvl = 1
    }

    if (!options || options.great) {
        var sheetGreat = generateIVSpreadSheet(data[name], 1500, minIV, lvlCap, minLvl)
        var great = generateMaximized(sheetGreat)

    }
    if (!options || options.ultra) {
        var sheetUltra = generateIVSpreadSheet(data[name], 2500, minIV, lvlCap, minLvl)
        var ultra = generateMaximized(sheetUltra)

    }
    if (!options || options.master) {
        var sheetMaster = generateIVSpreadSheet(data[name], 9999, minIV, lvlCap, minLvl)
        var master = generateMaximized(sheetMaster)

    }
    return { great, ultra, master }
}

//generates spread sheet of pok's stats
function generateIVSpreadSheet(pok, cpCap, minIV, lvlCap, minLvl) {
    var pokIVSpreadSheet = [];
    var maxA = {}
    var maxD = {}

    for (var cIV = 15.0; cIV >= minIV; cIV--) {
        for (var dIV = 15.0; dIV >= minIV; dIV--) {
            for (var aIV = 15.0; aIV >= minIV; aIV--) {
                for (var level = lvlCap; level >= minLvl ? minLvl : 1; level -= 0.5) {
                    //calculate cp every iteration
                    var levelMultiplier = levelData[level / 0.5]
                    var cpAtLvl = Math.trunc(((aIV + Number(pok.Atk)) * Math.pow((dIV + Number(pok.Def)), 0.5) *
                        Math.pow((cIV + Number(pok.Sta)), 0.5) * Math.pow(levelMultiplier, 2)) / 10);

                    //if cp is bigger than max, skip muther calculations
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
                    var efA = levelMultiplier * (aIV + pok.Atk);
                    var efD = levelMultiplier * (dIV + pok.Def);
                    var efS = Math.trunc(levelMultiplier * (cIV + pok.Sta));
                    var statProd = efA * efD * efS


                    if (compareStats(maxA.efA, efA, maxA.StatProduct, statProd)) {
                        maxA = {
                            StatProduct: (statProd),

                            Level: level,
                            Atk: aIV,
                            Def: dIV,
                            Sta: cIV,

                            efA: efA,
                            efD: efD,
                            efS: efS,
                        }
                    }

                    if (compareStats(maxD.efD, efD, maxD.StatProduct, statProd)) {
                        maxD = {
                            StatProduct: (statProd),

                            Level: level,
                            Atk: aIV,
                            Def: dIV,
                            Sta: cIV,

                            efA: efA,
                            efD: efD,
                            efS: efS,
                        }
                    }

                    pokIVSpreadSheet.push({
                        StatProduct: (statProd),

                        Level: level,
                        Atk: aIV,
                        Def: dIV,
                        Sta: cIV,

                        efA: efA,
                        efD: efD,
                        efS: efS,
                    })
                    break
                }
            }
        }
    };

    sortSheet(pokIVSpreadSheet)

    return { maxCom: pokIVSpreadSheet, maxA: maxA, maxD: maxD, }
}

function compareStats(statA, statB, statProdA, statProdB) {
    if (statA === statB) {
        if (statProdA === statProdB) {
            return false
        }
        if (statProdA > statProdB) {
            return false
        }
        return true
    }
    if (statA >= statB) {
        return false
    }
    return true
}

function sortSheet(sheet) {
    sheet.sort(function (a, b) {
        if (a.StatProduct === b.StatProduct) {
            return (b.Atk + b.Def + b.Sta) - (a.Atk + a.Def + a.Sta)
        }
        return b.StatProduct - a.StatProduct
    });
}


//selects Max overall, max attack and max defence results from spreadsheet. Generates default iv's as well
function generateMaximized(sheet) {
    return {
        Overall: {
            Level: String(sheet.maxCom[0].Level),
            Atk: String(sheet.maxCom[0].Atk),
            Def: String(sheet.maxCom[0].Def),
            Sta: String(sheet.maxCom[0].Sta),
        },
        Atk: {
            Level: String(sheet.maxA.Level),
            Atk: String(sheet.maxA.Atk),
            Def: String(sheet.maxA.Def),
            Sta: String(sheet.maxA.Sta),
        },
        Def: {
            Level: String(sheet.maxD.Level),
            Atk: String(sheet.maxD.Atk),
            Def: String(sheet.maxD.Def),
            Sta: String(sheet.maxD.Sta),

        },
        Default: {
            Level: String(sheet.maxCom[100].Level),
            Atk: String(sheet.maxCom[100].Atk),
            Def: String(sheet.maxCom[100].Def),
            Sta: String(sheet.maxCom[100].Sta),
        }
    }
}

export function culculateCP(name, Lvl, Atk, Def, Sta, base) {
    if (!name || !base[name]) {
        return 0
    }
    var levelMultiplier = levelData[checkLvl(Lvl) / 0.5];
    var cpAtLvl = Math.trunc(((checkIV(Atk) + Number(base[name]["Atk"])) * Math.pow((checkIV(Def) + Number(base[name]["Def"])), 0.5) *
        Math.pow((checkIV(Sta) + Number(base[name]["Sta"])), 0.5) * Math.pow(levelMultiplier, 2)) / 10)
    if (cpAtLvl < 10) {
        cpAtLvl = 10
    }
    return cpAtLvl
}

export function culculateBossCP(name, tier, base) {
    if (!name || !base[name]) {
        return 0
    }
    var bossCP = Math.trunc((15 + Number(base[name]["Atk"])) * Math.pow(15 + Number(base[name]["Def"]), 0.5) * Math.pow(tierHP[tier], 0.5) / 10);

    return bossCP
}

export function checkIV(IV) {
    if (isNaN(IV)) {
        return ""
    }
    if (Number(IV) > 15) {
        return 15
    }
    if (Number(IV) < 0) {
        return 0
    }
    if (!Number.isInteger(Number(IV))) {
        return Math.trunc(IV)
    }

    return Number(IV)
}

export function checkLvl(lvl) {
    if (isNaN(lvl)) {
        return ""
    }
    if (Number(lvl) > 45) {
        return 45
    }
    if (Number(lvl) < 1) {
        return ""
    }
    if (!Number.isInteger(lvl / 0.5)) {
        return Math.trunc(lvl)
    }

    return String(lvl)
}

export function calculateEffStat(name, lvl, value, stage, base, what, isShadow) {
    if (!name || !base[name]) {
        return 0
    };

    var levelMultiplier = levelData[checkLvl(lvl) / 0.5];
    var stageMultiplier;
    (what !== "Sta") ? stageMultiplier = stagesData[stage] : stageMultiplier = 1;

    var shadowMultipler = 1;
    (isShadow === "true") ?
        (what === "Atk" ? shadowMultipler = 1.2 : shadowMultipler = 0.833) :
        shadowMultipler = 1;
    var effValue = (checkIV(value) + Number(base[name][what])) * levelMultiplier * stageMultiplier * shadowMultipler;
    return (what !== "Sta") ? Math.round(effValue * 10) / 10 : Math.trunc(effValue)
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
    let extractedNumber = parseInt(string, 10);
    if (extractedNumber) {
        return extractedNumber
    }
    return ""
}
export function calculateDamage(movePower, aAttack, dDefence, multiplier) {
    if (aAttack === 0 || dDefence === 0 || multiplier === 0) {
        return 0
    }
    return Math.trunc(movePower * 0.5 * (aAttack / dDefence) * multiplier + 1)
}

export function calculateMultiplier(aTypes, dTypes, mType) {
    if (!aTypes || !dTypes) {
        return 0
    }
    const pvpMultiplier = 1.3
    let stabBonus
    (aTypes.includes(mType)) ? stabBonus = 1.2 : stabBonus = 1

    let moveEfficiency = effectivenessData[mType]
    let seMultiplier = 1
    for (let i = 0; i < dTypes.length; i++) {
        if (moveEfficiency[dTypes[i]] !== 0) {
            seMultiplier *= moveEfficiency[dTypes[i]]
        }
    }

    return pvpMultiplier * seMultiplier * stabBonus
}

export function returnEffAtk(AtkIV, Atk, Lvl, isShadow) {
    return (Number(AtkIV) + Atk) * levelData[checkLvl(Lvl) / 0.5] * (isShadow === "true" ? 1.2 : 1)
}

export function pveDamage(Damage, effAtk, effDef, mult) {
    return Math.trunc(Damage * 0.5 * (effAtk / effDef) * mult) + 1
}

export function getPveMultiplier(aTypes, dTypes, mType, weatherType, friendStage) {

    let stabBonus = (aTypes.includes(mType)) ? 1.2 : 1

    let moveEfficiency = effectivenessData[mType]
    let seMultiplier = 1
    for (let i = 0; i < dTypes.length; i++) {
        if (moveEfficiency[dTypes[i]] !== 0) {
            seMultiplier *= moveEfficiency[dTypes[i]]
        }
    }

    let weatherMul = 1
    if (weather[weatherType][mType]) {
        weatherMul = weather[weatherType][mType]
    }

    return stabBonus * friendship[friendStage] * seMultiplier * weatherMul
}





export function encodeQueryData(data) {
    var res = [];

    res.push(data.Shields);

    res.push(data.Lvl);
    res.push(data.Atk);
    res.push(data.Def);
    res.push(data.Sta);
    res.push(data.name);

    res.push(data.AtkStage);
    res.push(data.DefStage);
    res.push(data.InitialHP);
    res.push(data.InitialEnergy);
    res.push(data.IsGreedy);
    res.push(data.IsShadow);

    res.push(data.QuickMove);
    res.push(data.ChargeMove1);
    res.push(data.ChargeMove2);

    return encodeURIComponent(res.join("_"));
}

export function extractName(name) {
    let splitted = name.split(" ")
    if (splitted.length === 1) {
        return { Name: name, Additional: "" }
    }

    if (splitted[0] === "Galarian" || splitted[0] === "Alolan" || splitted[0] === "Black" || splitted[0] === "White" ||
        splitted[0] === "Armored") {
        return { Name: splitted[1], Additional: splitted[0] + ((splitted.length > 2) ? ", " + splitted.slice(2).join(" ").replace(/[()]/g, "") : "") }
    }

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
        Name: array[0],
        QuickMove: array[1],
        ChargeMove: array[2],

        Lvl: array[3],
        Atk: array[4],
        Def: array[5],
        Sta: array[6],

        IsShadow: array[7],

        quickMovePool: "",
        chargeMovePool: "",

    }
}

export function encodePveAttacker(data) {
    var res = [];

    res.push(data.Name);

    res.push(data.QuickMove);
    res.push(data.ChargeMove);

    res.push(data.Lvl);
    res.push(data.Atk);
    res.push(data.Def);
    res.push(data.Sta);

    res.push(data.IsShadow);
    return encodeURIComponent(res.join("_"));
}

export function extractPveBoss(array) {
    return {
        Name: array[0],
        QuickMove: array[1],
        ChargeMove: array[2],

        Tier: array[3],

        quickMovePool: "",
        chargeMovePool: "",
    }
}

export function encodePveBoss(data) {
    var res = [];

    res.push(data.Name);

    res.push(data.QuickMove);
    res.push(data.ChargeMove);

    res.push(data.Tier);

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
    var res = [];

    res.push(data.FriendshipStage);
    res.push(data.Weather);
    res.push(data.DodgeStrategy);

    res.push(data.PartySize);
    res.push(data.PlayersNumber);
    res.push(data.IsAggresive);

    return encodeURIComponent(res.join("_"));
}

export function pveattacker() {
    return {
        Name: "",
        QuickMove: "",
        ChargeMove: "",

        Lvl: "35",
        Atk: "15",
        Def: "15",
        Sta: "15",

        IsShadow: "false",

        quickMovePool: "",
        chargeMovePool: "",
    }
}

export function boss(locale) {
    return {
        Name: locale,
        QuickMove: "",
        ChargeMove: "",

        Tier: "4",

        quickMovePool: "",
        chargeMovePool: "",
    }
}

export function pveobj() {
    return {
        FriendshipStage: "0",
        Weather: "0",
        DodgeStrategy: "0",

        PartySize: "18",
        PlayersNumber: "3",
        IsAggresive: "false",
    }
}

export function returnPokList(pokBase, addNone, locale) {
    let pokList = [];
    if (addNone) {
        pokList.push({
            value: locale,
            label: <div style={{ textAlign: "left" }} >
                {locale}
            </div>,
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
        name: array[5],
        Lvl: array[1],
        Atk: array[2],
        Def: array[3],
        Sta: array[4],
        Shields: array[0],

        AtkStage: array[6],
        DefStage: array[7],
        InitialHP: array[8],
        InitialEnergy: array[9],
        IsGreedy: array[10],
        IsShadow: array[11],

        QuickMove: array[12],
        ChargeMove1: array[13],
        ChargeMove2: array[14],

        quickMovePool: "",
        chargeMovePool: "",
        ivSet: "",

        effAtk: "",
        effDef: "",
        effSta: "",

        HP: undefined,
        Energy: undefined,
    }
}
export function pokemon(locale) {
    return {
        name: locale,
        Lvl: "",
        Atk: "",
        Def: "",
        Sta: "",
        Shields: "",

        AtkStage: "",
        DefStage: "",
        InitialHP: "",
        InitialEnergy: "",
        IsGreedy: "",
        IsShadow: "",

        QuickMove: "",
        ChargeMove1: "",
        ChargeMove2: "",


        quickMovePool: "",
        chargeMovePool: "",
        ivSet: "",

        effAtk: "",
        effDef: "",
        effSta: "",

        HP: undefined,
        Energy: undefined,

        showMenu: false,
    }
}


export function selectQuick(movelist, moveTable, pokName, pokTable) {
    var bestScore = 0
    var bestName = ""
    //for every move
    for (let i = 0; i < movelist.length; i++) {
        //exepr select option
        if (movelist[i].key === "Select..." || movelist[i].key === "") {
            continue
        }
        let duration = moveTable[movelist[i].key].PvpDurationSeconds
        let damage = moveTable[movelist[i].key].PvpDamage
        let energy = moveTable[movelist[i].key].PvpEnergy
        let stab = 1
        //define stab
        for (let j = 0; j < pokTable[pokName].Type.Length; j++) {
            if (pokTable[pokName].Type[j] === moveTable[movelist[i].key].MoveType) {
                stab = 1.2
                break
            }
            continue
        }

        //and calculate score
        let score = Math.pow(((damage * stab) / duration) * Math.pow(energy / duration, 1.9), 1 / 2)
        if (score > bestScore) {
            bestScore = score
            bestName = moveTable[movelist[i].key].Title
        }
    }
    return bestName
}

export function selectCharge(movelist, moveTable, pokName, pokTable) {
    var primaryName = ""
    var bestScore = 0
    var bestEnergy = 0
    var primaryType = ""
    //define primary move
    //for every move
    for (let i = 0; i < movelist.length; i++) {
        //exept select option
        if (movelist[i].key === "Select..." || movelist[i].key === "") {
            continue
        }
        //filter self-harm moves
        if (moveTable[movelist[i].key].StageDelta < 0 && moveTable[movelist[i].key].Subject === "Self") {
            continue
        }
        let damage = moveTable[movelist[i].key].PvpDamage
        let energy = -moveTable[movelist[i].key].PvpEnergy
        let stab = 1
        //define stab
        for (let j = 0; j < pokTable[pokName].Type.Length; j++) {
            if (pokTable[pokName].Type[j] === moveTable[movelist[i].key].MoveType) {
                stab = 1.2
                break
            }
            continue
        }
        //and calculate score
        let score = stab * damage / Math.pow(energy, 2)
        if (score > bestScore) {
            bestScore = score
            bestEnergy = energy
            primaryName = moveTable[movelist[i].key].Title
            primaryType = moveTable[movelist[i].key].MoveType
            continue
        }
        // is DPE is equal
        if (score === bestScore) {
            if (energy < bestEnergy) {
                bestScore = score
                bestEnergy = energy
                primaryName = moveTable[movelist[i].key].Title
                primaryType = moveTable[movelist[i].key].MoveType
                continue
            }
        }
    }

    //define secondary move
    //for every move
    bestEnergy = 0
    bestScore = 0
    var secodaryName = ""
    var secondaryType = ""
    for (let i = 0; i < movelist.length; i++) {
        //exept select option and primary move
        if (movelist[i].key === "Select..." || movelist[i].key === "" || movelist[i].key === primaryName) {
            continue
        }
        let damage = moveTable[movelist[i].key].PvpDamage
        let energy = -moveTable[movelist[i].key].PvpEnergy
        let stab = 1
        //define stab
        for (let j = 0; j < pokTable[pokName].Type.Length; j++) {
            if (pokTable[pokName].Type[j] === moveTable[movelist[i].key].MoveType) {
                stab = 1.2
                break
            }
            continue
        }
        //and calculate score
        let score = stab * damage / Math.pow(energy, 2)
        if (score > bestScore) {
            bestScore = score
            bestEnergy = energy
            secodaryName = moveTable[movelist[i].key].Title
            secondaryType = moveTable[movelist[i].key].MoveType
            continue
        }
        // is DPE^2 is equal
        if (score === bestScore) {
            if (energy < bestEnergy) {
                bestScore = score
                bestEnergy = energy
                secodaryName = moveTable[movelist[i].key].Title
                secondaryType = moveTable[movelist[i].key].MoveType
                continue
            }
        }
        if (primaryType === secondaryType) {
            if (primaryType !== moveTable[movelist[i].key].MoveType) {
                bestScore = score
                bestEnergy = energy
                secodaryName = moveTable[movelist[i].key].Title
                secondaryType = moveTable[movelist[i].key].MoveType
            }
        }
    }


    return { primaryName, secodaryName }
}

export function returnRateStyle(rate) {

    if (rate >= 630) {
        return ["+2", "res4"]
    }
    if (rate > 500) {
        return ["+1", "res3"]
    }
    if (rate === 500) {
        return ["0", "res0"]
    }
    if (rate >= 370) {
        return ["-1", "res1"]
    }
    return ["-2", "res2"]
}

export function returnVunStyle(rate) {
    if (rate > 1.600) {
        return "res2"
    }
    if (rate > 1.000) {
        return "res1"
    }
    if (rate === "1.000") {
        return "res0"
    }
    if (rate > 0.391) {
        return "res3"
    }
    return "res4"
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
