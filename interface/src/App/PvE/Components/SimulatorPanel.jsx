import React from "react"
import LocalizedStrings from "react-localization"
import { UnmountClosed } from "react-collapse"

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

    canBoost(name) {
        if (name.indexOf("Mega ") !== -1 || name.indexOf("Primal ") !== -1 || name.indexOf("Нет") !== -1 || name.indexOf("None") !== -1) {
            return true
        }
        return false
    }

    render() {
        console.log(this.props.value.pveObj)
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

                <div className="col-12 px-1">
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
                </div>

                <UnmountClosed isOpened={this.props.value.pveObj.SupportSlotEnabled !== "false"}>
                    <div className="col-12 px-1 text-center ">
                        <PokemonPanel
                            title={pveStrings.sup}
                            attr="supportPokemon"
                            canBeShadow={false}

                            pokemonTable={this.props.pokemonTable}
                            moveTable={this.props.moveTable}
                            pokList={this.props.pokList.filter((etry) => this.canBoost(etry.value))}
                            chargeMoveList={this.props.chargeMoveList}
                            quickMoveList={this.props.quickMoveList}

                            value={this.props.value.supportPokemon}

                            onChange={this.props.onChange}

                            onClick={this.props.onClick}
                        />
                    </div>
                </UnmountClosed>

                <div className="col-12 text-center px-1">
                    <div className="row m-0">
                        <PveSettingsPanel
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