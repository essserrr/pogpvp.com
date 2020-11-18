import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import CustomRaidSettings from "./CustomRaidSettings/CustomRaidSettings";
import PokemonPanel from "./Panels/PokemonPanel/PokemonPanel";
import BossPanel from "./Panels/BossPanel/BossPanel";
import PveSettingsPanel from "./Panels/PveSettingsPanel/PveSettingsPanel";

import { locale } from "locale/Pve/Pve";
import { getCookie } from "js/getCookie";

let pveStrings = new LocalizedStrings(locale);

const SimulatorPanel = React.memo(function SimulatorPanel(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <BossPanel
                    title={pveStrings.boss}
                    attr="bossObj"

                    pokemonTable={props.pokemonTable}
                    moveTable={props.moveTable}
                    pokList={props.pokList}
                    chargeMoveList={props.chargeMoveList}
                    quickMoveList={props.quickMoveList}

                    value={props.value.bossObj}
                    settingsValue={props.value.pveObj}

                    onChange={props.onChange}
                    onClick={props.onClick}

                />
            </Grid>

            {!props.forCustomPve &&
                <Grid item xs={12}>
                    <PokemonPanel
                        title={pveStrings.attacker}
                        attr="attackerObj"
                        canBeShadow={true}

                        pokemonTable={props.pokemonTable}
                        moveTable={props.moveTable}
                        pokList={props.pokList}
                        chargeMoveList={props.chargeMoveList}
                        quickMoveList={props.quickMoveList}

                        value={props.value.attackerObj}
                        settingsValue={props.value.pveObj}

                        onChange={props.onChange}
                        onClick={props.onClick}
                    />
                </Grid>}

            {!props.forCustomPve &&
                <Grid item xs={12}>
                    <Collapse in={props.value.pveObj.SupportSlotEnabled !== "false"} unmountOnExit>
                        <PokemonPanel
                            title={pveStrings.sup}
                            attr="supportPokemon"
                            canBeShadow={false}

                            pokemonTable={props.pokemonTable}
                            moveTable={props.moveTable}
                            pokList={props.boostersList}
                            chargeMoveList={props.chargeMoveList}
                            quickMoveList={props.quickMoveList}

                            value={props.value.supportPokemon}

                            onChange={props.onChange}

                            onClick={props.onClick}
                        />
                    </Collapse>
                </Grid>}

            {props.forCustomPve &&
                <Grid item xs={12}>
                    <CustomRaidSettings
                        title={pveStrings.attacker}
                        attr="userSettings"

                        settingsValue={props.value.pveObj}
                        value={props.value.userSettings}
                        userParties={props.userParties}

                        onChange={props.onChange}
                    />
                </Grid>}

            <Grid item xs={12}>
                <PveSettingsPanel
                    forCustomPve={props.forCustomPve}
                    findInCollection={props.value.userSettings && props.value.userSettings.FindInCollection}
                    title={pveStrings.raid}
                    attr={"pveObj"}
                    value={props.value.pveObj}
                    onChange={props.onChange}
                />
            </Grid>

        </Grid>
    )
});

export default SimulatorPanel;

SimulatorPanel.propTypes = {
    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,

    pokList: PropTypes.arrayOf(PropTypes.object),
    boostersList: PropTypes.arrayOf(PropTypes.object),
    chargeMoveList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),

    value: PropTypes.object,

    onChange: PropTypes.func,
    onClick: PropTypes.func,
};