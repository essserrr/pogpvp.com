import React from "react"
import LocalizedStrings from "react-localization"
import { UnmountClosed } from "react-collapse"

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
            <div className={"row justify-content-between m-0"}>
                <div className="col-12 px-1 text-center ">
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
                </div>

                {!this.props.forCustomPve && <div className="col-12 px-1">
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
                </div>}

                {!this.props.forCustomPve && <UnmountClosed isOpened={this.props.value.pveObj.SupportSlotEnabled !== "false"}>
                    <div className="col-12 px-1 text-center ">
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
                    </div>
                </UnmountClosed>}


                {this.props.forCustomPve &&
                    <div className="col-12 text-center px-1 mb-3">
                        <CustomRaidSettings
                            title={pveStrings.attacker}
                            attr="userSettings"

                            settingsValue={this.props.value.pveObj}
                            value={this.props.value.userSettings}
                            userParties={this.props.userParties}

                            onChange={this.props.onChange}
                        />
                    </div>}

                <div className="col-12 text-center px-1">
                    <div className="row m-0">
                        <PveSettingsPanel
                            forCustomPve={this.props.forCustomPve}
                            findInCollection={this.props.value.userSettings && this.props.value.userSettings.FindInCollection}
                            title={pveStrings.raid}
                            attr={"pveObj"}
                            value={this.props.value.pveObj}
                            onChange={this.props.onChange}
                        />
                    </div>
                </div>

            </div>
        )
    }

}

export default SimulatorPanel