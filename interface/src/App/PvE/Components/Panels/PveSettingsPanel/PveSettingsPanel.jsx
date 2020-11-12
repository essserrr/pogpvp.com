import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import Input from "App/Components/Input/Input";
import WithIcon from "App/Components/WithIcon/WithIcon";
import PanelWithTitle from "../PanelWithTitle";

import { settings } from "locale/Pve/Settings/Settings";
import { getCookie } from "js/getCookie";

let pveStrings = new LocalizedStrings(settings)

const PveSettingsPanel = React.memo(function PveSettingsPanel(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <PanelWithTitle title={props.title}>
            <Grid container spacing={2} justify="center">

                <Grid item xs={6}>
                    <Input
                        select
                        name="Weather"
                        value={props.value.Weather}
                        attr={props.attr}
                        label={pveStrings.weather}
                        onChange={props.onChange}
                    >
                        <MenuItem value="0">{pveStrings.weatherList[0]}</MenuItem>
                        <MenuItem value="1">{pveStrings.weatherList[1]}</MenuItem>
                        <MenuItem value="2">{pveStrings.weatherList[2]}</MenuItem>
                        <MenuItem value="3">{pveStrings.weatherList[3]}</MenuItem>
                        <MenuItem value="4">{pveStrings.weatherList[4]}</MenuItem>
                        <MenuItem value="5">{pveStrings.weatherList[5]}</MenuItem>
                        <MenuItem value="6">{pveStrings.weatherList[6]}</MenuItem>
                        <MenuItem value="7">{pveStrings.weatherList[7]}</MenuItem>
                    </Input>
                </Grid>

                <Grid item xs={6}>
                    <Input
                        select
                        name="FriendshipStage"
                        value={props.value.FriendshipStage}
                        attr={props.attr}
                        label={pveStrings.friend}
                        onChange={props.onChange}
                    >
                        <MenuItem value="0">{`${pveStrings.friendList.no}`}</MenuItem>
                        <MenuItem value="1">{`${pveStrings.friendList.good} (3%)`}</MenuItem>
                        <MenuItem value="2">{`${pveStrings.friendList.great} (5%)`}</MenuItem>
                        <MenuItem value="3">{`${pveStrings.friendList.ultra} (7%)`}</MenuItem>
                        <MenuItem value="4">{`${pveStrings.friendList.best} (10%)`}</MenuItem>
                        <MenuItem value="5">{`${pveStrings.friendList.good} (6%) ${pveStrings.friendList.ev}`}</MenuItem>
                        <MenuItem value="6">{`${pveStrings.friendList.great} (12%) ${pveStrings.friendList.ev}`}</MenuItem>
                        <MenuItem value="6">{`${pveStrings.friendList.ultra} (18%) ${pveStrings.friendList.ev}`}</MenuItem>
                        <MenuItem value="6">{`${pveStrings.friendList.best} (25%) ${pveStrings.friendList.ev}`}</MenuItem>
                    </Input>
                </Grid>

                {!props.forCustomPve &&
                    <Grid item xs={6}>
                        <WithIcon tip={pveStrings.playernumbTip}>
                            <Input
                                select
                                name="PlayersNumber"
                                value={props.value.PlayersNumber}
                                attr={props.attr}
                                label={pveStrings.playernumb}
                                onChange={props.onChange}
                            >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="6">6</MenuItem>
                                <MenuItem value="7">7</MenuItem>
                                <MenuItem value="8">8</MenuItem>
                                <MenuItem value="9">9</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="11">11</MenuItem>
                                <MenuItem value="12">12</MenuItem>
                                <MenuItem value="13">13</MenuItem>
                                <MenuItem value="14">14</MenuItem>
                                <MenuItem value="15">15</MenuItem>
                                <MenuItem value="16">16</MenuItem>
                                <MenuItem value="17">17</MenuItem>
                                <MenuItem value="18">18</MenuItem>
                                <MenuItem value="19">19</MenuItem>
                                <MenuItem value="20">20</MenuItem>
                            </Input>
                        </WithIcon>
                    </Grid>}

                {!(props.forCustomPve && !props.findInCollection) &&
                    <Grid item xs={6}>
                        <WithIcon tip={pveStrings.sizetip}>
                            <Input
                                select
                                name="PartySize"
                                value={props.value.PartySize}
                                attr={props.attr}
                                label={pveStrings.partysize}
                                onChange={props.onChange}
                            >
                                <MenuItem value="6">{`6 (1 ${pveStrings.party})`}</MenuItem>
                                <MenuItem value="12">{`12 (2 ${pveStrings.party})`}</MenuItem>
                                <MenuItem value="18">{`18 (3 ${pveStrings.party})`}</MenuItem>
                            </Input>
                        </WithIcon>
                    </Grid>}

                <Grid item xs={6}>
                    <WithIcon tip={pveStrings.dodgetip}>
                        <Input
                            select
                            name="DodgeStrategy"
                            value={props.value.DodgeStrategy}
                            attr={props.attr}
                            label={pveStrings.dodge}
                            onChange={props.onChange}
                        >
                            <MenuItem value="0">{pveStrings.dodgeList}</MenuItem>
                            <MenuItem value="1">25%</MenuItem>
                            <MenuItem value="2">50%</MenuItem>
                            <MenuItem value="3">75%</MenuItem>
                            <MenuItem value="4">100%</MenuItem>
                        </Input>
                    </WithIcon>
                </Grid>

            </Grid>
        </PanelWithTitle>
    )
});

export default PveSettingsPanel;

PveSettingsPanel.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    attr: PropTypes.string,

    forCustomPve: PropTypes.bool,
    findInCollection: PropTypes.bool,

    value: PropTypes.object.isRequired,

    onChange: PropTypes.func,
};