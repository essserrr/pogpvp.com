import React from "react";
import LocalizedStrings from "react-localization";
import { UnmountClosed } from "react-collapse";

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import CustomRaidSettings from "./CustomRaidSettings/CustomRaidSettings"
import PokemonPanel from "./Panels/PokemonPanel/PokemonPanel"
import BossPanel from "./Panels/BossPanel/BossPanel"
import PveSettingsPanel from "./Panels/PveSettingsPanel/PveSettingsPanel"


import { pveLocale } from "../../../locale/pveLocale"
import { getCookie } from "../../../js/getCookie"

let pveStrings = new LocalizedStrings(pveLocale);

class SimulatorPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }



    render() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <BossPanel
                        title={pveStrings.boss}
                        attr="bossObj"

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

                        value={this.props.value.bossObj}
                        settingsValue={this.props.value.pveObj}

                        onChange={this.props.onChange}
                        onClick={this.props.onClick}

                    />
                </Grid>

                {!this.props.forCustomPve &&
                    <Grid item xs={12}>
                        <PokemonPanel
                            title={pveStrings.attacker}
                            attr="attackerObj"
                            canBeShadow={true}

                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.moveTable}
                            pokList={this.props.pokList}
                            chargeMoveList={this.props.chargeMoveList}
                            quickMoveList={this.props.quickMoveList}

                            value={this.props.value.attackerObj}
                            settingsValue={this.props.value.pveObj}

                            onChange={this.props.onChange}
                            onClick={this.props.onClick}
                        />
                    </Grid>}

                {!this.props.forCustomPve &&
                    <Grid item xs={12}>
                        <Collapse in={this.props.value.pveObj.SupportSlotEnabled !== "false"} unmountOnExit>
                            <PokemonPanel
                                title={pveStrings.sup}
                                attr="supportPokemon"
                                canBeShadow={false}

                                pokemonTable={this.props.pokemonTable}
                                moveTable={this.props.moveTable}
                                pokList={this.props.boostersList}
                                chargeMoveList={this.props.chargeMoveList}
                                quickMoveList={this.props.quickMoveList}

                                value={this.props.value.supportPokemon}

                                onChange={this.props.onChange}

                                onClick={this.props.onClick}
                            />
                        </Collapse>
                    </Grid>}

                {this.props.forCustomPve &&
                    <Grid item xs={12}>
                        <CustomRaidSettings
                            title={pveStrings.attacker}
                            attr="userSettings"

                            settingsValue={this.props.value.pveObj}
                            value={this.props.value.userSettings}
                            userParties={this.props.userParties}

                            onChange={this.props.onChange}
                        />
                    </Grid>}

                <Grid item xs={12}>
                    <PveSettingsPanel
                        forCustomPve={this.props.forCustomPve}
                        findInCollection={this.props.value.userSettings && this.props.value.userSettings.FindInCollection}
                        title={pveStrings.raid}
                        attr={"pveObj"}
                        value={this.props.value.pveObj}
                        onChange={this.props.onChange}
                    />
                </Grid>

            </Grid>
        )
    }

}

export default SimulatorPanel