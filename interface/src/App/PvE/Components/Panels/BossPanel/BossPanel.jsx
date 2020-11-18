import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Input from "App/Components/Input/Input";
import WithIcon from "App/Components/WithIcon/WithIcon";
import PanelWithTitle from "../PanelWithTitle";
import PvePokemon from "../../PvePokemon"

import { pveLocale } from "locale/Pve/IsAgressive/IsAgressive";
import { getCookie } from "js/getCookie";

let pveStrings = new LocalizedStrings(pveLocale)

const BossPanel = React.memo(function BossPanel(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    const { title, value, onChange, settingsValue, ...other } = props

    return (
        <PanelWithTitle title={title}>
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                    <PvePokemon
                        value={value}
                        onChange={onChange}
                        {...other}
                    />
                </Grid>
                <Grid item xs={6}>
                    <WithIcon tip={pveStrings.aggresivetip}>
                        <Input
                            select
                            name="IsAggresive"
                            value={settingsValue.IsAggresive}
                            attr="pveObj"
                            label={pveStrings.aggreasive}
                            onChange={onChange}
                        >
                            <MenuItem alignItems="flex-start" value="false">{pveStrings.aggrList.norm}</MenuItem>
                            <MenuItem value="true">{pveStrings.aggrList.aggr}</MenuItem>
                        </Input>
                    </WithIcon>
                </Grid>
            </Grid>
        </PanelWithTitle>
    )
});


export default BossPanel;

BossPanel.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    attr: PropTypes.string,

    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,
    pokList: PropTypes.arrayOf(PropTypes.object),
    chargeMoveList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),

    value: PropTypes.object.isRequired,
    settingsValue: PropTypes.object.isRequired,

    onChange: PropTypes.func,
    onClick: PropTypes.func,
};