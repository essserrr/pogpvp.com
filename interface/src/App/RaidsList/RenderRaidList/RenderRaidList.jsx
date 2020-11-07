import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import RaidTier from "./RaidTier/RaidTier";
import RaidIcon from "./RaidIcon/RaidIcon";
import FilteredRaidList from "./FilteredRaidList/FilteredRaidList";

import { locale } from "locale/Raids/Raids";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const RenderRaidList = React.memo(function RenderRaidList(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const tiers = [
        { name: "Mega Raids", value: 5, key: "megaRaids" },
        { name: "Tier 5", value: 5, key: "tier5" },
        { name: "Tier 3", value: 3, key: "tier3" },
        { name: "Tier 1", value: 1, key: "tier1" },
    ]

    const returnRaidList = () => {
        return tiers.map((value) =>
            <Grid item xs={12} key={value.key}>
                <RaidTier
                    title={<RaidIcon n={value.value}
                        title={value.name !== "Mega Raids" ? `${strings.tierlist.raidtier} ${value.value}` : strings.tierlist.mega} />}

                    list={props.children[value.name]}
                    pokTable={props.pokTable}
                    i={value.value}
                />
            </Grid>)
    }


    return (
        <Grid container justify="center" spacing={2}>
            <FilteredRaidList filter={props.filter}>
                {returnRaidList()}
            </FilteredRaidList>
        </Grid>
    )
});

export default RenderRaidList;

RenderRaidList.propTypes = {
    pokTable: PropTypes.object.isRequired,
    props: PropTypes.object,
    children: PropTypes.object,
};