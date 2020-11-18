import { pveCustomParty } from "./pveCustomParty";

export function pveUserSettings() {
    return { FindInCollection: true, SortByDamage: "true", UserPlayers: [[pveCustomParty(), pveCustomParty(), pveCustomParty()],], }
}