import React from "react"
import LocalizedStrings from "react-localization"

import RaidTier from "./RaidTier/RaidTier"
import IconMultiplicator from "./IconMultiplicator/IconMultiplicator"
import FilteredRaidList from "./FilteredRaidList/FilteredRaidList"

import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/getCookie"

let strings = new LocalizedStrings(locale)

class RenderRaidList extends React.Component {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    returnRaidList() {
        const tiers = [{ name: "Mega Raids", value: 5, key: "megaRaids" },
        { name: "Tier 5", value: 5, key: "tier5" },
        { name: "Tier 3", value: 3, key: "tier3" },
        { name: "Tier 1", value: 1, key: "tier1" }]

        return tiers.map((value) => <RaidTier
            key={value.key}
            class="separator capsSeparator"

            title={
                <IconMultiplicator
                    title={value.name !== "Mega Raids" ? `${strings.tierlist.raidtier} ${value.value}` : strings.tierlist.mega}
                    n={value.value} />}
            list={this.props.list[value.name]}
            pokTable={this.props.pokTable}
            i={value.value}
        />
        )
    }

    render() {
        return (
            <FilteredRaidList
                list={this.returnRaidList()}
                filter={this.props.filter}
            />
        );
    }
}

export default RenderRaidList






