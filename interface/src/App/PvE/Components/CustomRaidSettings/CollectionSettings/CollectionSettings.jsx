import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Input from "App/Components/Input/Input";
import Switch from 'App/Components/Switch/Switch';

import { settings } from "locale/Pve/Settings/Settings";
import { labels } from "locale/Pve/PokemonLabels";
import { getCookie } from "js/getCookie"

let strings = new LocalizedStrings(settings);
let labelsStrings = new LocalizedStrings(labels);

const CollectionSettings = React.memo(function CollectionSettings(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    labelsStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Input
                    select
                    name="SortByDamage"
                    value={props.value}
                    attr={props.attr}
                    label={strings.aggreasive}
                    onChange={props.onChange}
                >
                    <MenuItem value="true">{strings.customsort.dmg}</MenuItem>
                    <MenuItem value="false">{strings.customsort.dps}</MenuItem>
                </Input>
            </Grid>

            <Grid item xs={6}>
                <Switch
                    checked={props.settingsValue.SupportSlotEnabled !== "false" ? "checked" : false}
                    onChange={props.onChange}
                    attr={"pveObj"}
                    name={"SupportSlotEnabled"}
                    color="primary"
                    label={labelsStrings.supen}
                />
            </Grid>
        </Grid>
    )
});


export default CollectionSettings;

CollectionSettings.propTypes = {
    onChange: PropTypes.func,

    attr: PropTypes.string,
    settingsValue: PropTypes.object,


    value: PropTypes.string.isRequired,
};