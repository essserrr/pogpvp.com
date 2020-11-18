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