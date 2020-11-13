import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import Switch from "App/Components/Switch/Switch";
import Input from "App/Components/Input/Input";
import GreyPaper from 'App/Components/GreyPaper/GreyPaper';

import { getCookie } from "js/getCookie";
import { options } from "locale/Components/Options/locale";
import { pvp } from "locale/Pvp/Pvp";

let strings = new LocalizedStrings(pvp);
let optionStrings = new LocalizedStrings(options);

const UpperPanel = React.memo(function UpperPanel(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { league, onChange, checked, onPvpokeEnable, } = props;

    return (
        <GreyPaper elevation={4} enablePadding paddingMult={0.5}>
            <Grid container alignItems="center" spacing={2} item xs={12} wrap="nowrap">

                <Grid item xs>
                    <Input select name="league" value={league} label={strings.title.league} onChange={onChange}>
                        <MenuItem value="great">{optionStrings.options.league.great}</MenuItem>
                        <MenuItem value="ultra">{optionStrings.options.league.ultra}</MenuItem>
                        <MenuItem value="master">{optionStrings.options.league.master}</MenuItem>
                    </Input>
                </Grid>

                <Grid item xs="auto">
                    <Grid container alignItems="center" spacing={2}>

                        <Grid item xs="auto">
                            <Switch
                                checked={checked}
                                onChange={onPvpokeEnable}
                                name="pvpoke"
                                color="primary"
                                label={strings.title.pvpoke}
                            />
                        </Grid>

                        <Grid item xs="auto">
                            <Tooltip arrow placement="top" title={<Typography>{strings.tips.pvpoke}</Typography>}>
                                <HelpOutlineIcon />
                            </Tooltip>
                        </Grid>

                    </Grid>
                </Grid>

            </Grid>
        </GreyPaper>
    )
});

export default UpperPanel;

UpperPanel.propTypes = {
    league: PropTypes.string,
    onChange: PropTypes.func,

    checked: PropTypes.bool,
    onPvpokeEnable: PropTypes.func,
};