import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Input from "App/Components/Input/Input";
import Stats from "App/PvP/components/Stats/Stats";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";
import { labels } from "locale/Pve/PokemonLabels";
import { options } from "locale/Pve/Options";

let labelStrings = new LocalizedStrings(labels);
let optionStrings = new LocalizedStrings(options);
let strings = new LocalizedStrings(userLocale)

const Filters = React.memo(function Filters(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    labelStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container spacing={2}>
            <Grid item xs={6} lg={4}>
                <Input
                    attr={props.attr}
                    name={"Name"}
                    value={props.value.Name}

                    onChange={props.onChange}
                    label={strings.userpok.pokname}
                />
            </Grid>
            <Grid item xs={6} lg={4}>
                <Input
                    attr={props.attr}
                    name={"QuickMove"}
                    value={props.value.QuickMove}

                    onChange={props.onChange}
                    label={strings.userpok.qname}
                />
            </Grid>
            <Grid item xs={6} lg={4}>
                <Input
                    attr={props.attr}
                    name={"ChargeMove"}
                    value={props.value.ChargeMove}

                    onChange={props.onChange}
                    label={strings.userpok.chname}
                />
            </Grid>
            <Grid item xs={6} lg={4}>
                <Stats
                    Lvl={props.value.Lvl}
                    Atk={props.value.Atk}
                    Def={props.value.Def}
                    Sta={props.value.Sta}
                    attr={props.attr}
                    onChange={props.onChange}
                />
            </Grid>
            <Grid item xs={6} lg={4}>
                <Input
                    select
                    name="IsShadow"
                    value={props.value.IsShadow}
                    attr={props.attr}
                    label={labelStrings.type}
                    onChange={props.onChange}
                >
                    <MenuItem value="" attr={props.attr}></MenuItem>
                    <MenuItem value="false" attr={props.attr}>{optionStrings.type.normal}</MenuItem>
                    <MenuItem value="true" attr={props.attr}>{optionStrings.type.shadow}</MenuItem>
                </Input>
            </Grid>
        </Grid>
    )
});

export default Filters;

Filters.propTypes = {
    onChange: PropTypes.func,
    attr: PropTypes.string,
    value: PropTypes.object.isRequired,
};