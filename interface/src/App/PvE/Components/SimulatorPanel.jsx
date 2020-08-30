import React from "react"
import LocalizedStrings from "react-localization"

import PokemonPanel from "./Panels/PokemonPanel/PokemonPanel"
import BossPanel from "./Panels/BossPanel/BossPanel"
import PveSettingsPanel from "./Panels/PveSettingsPanel/PveSettingsPanel"


import { locale } from "../../../locale/locale"
import { pveLocale } from "../../../locale/pveLocale"
import { getCookie } from "../../../js/getCookie"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale);

class SimulatorPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    }

    render() {
        return (
            <div className={this.props.className}>
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

                        value={this.props.value}
                        onChange={this.props.onChange}

                        onClick={this.props.onClick}
                    />
                </div>

                <div className="col-12 px-1 text-center ">
                    <PokemonPanel
                        title={pveStrings.attacker}
                        attr="supportPokemon"
                        canBeShadow={false}

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

                        value={this.props.value}
                        onChange={this.props.onChange}

                        onClick={this.props.onClick}
                    />
                </div>

                <div className="col-12 px-1 text-center ">
                    <BossPanel
                        title={pveStrings.boss}
                        attr="bossObj"

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}
                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

                        value={this.props.value}
                        onChange={this.props.onChange}
                        onClick={this.props.onClick}

                    />
                </div>
                <div className="col-12 text-center px-1">
                    <div className="row m-0">
                        <PveSettingsPanel
                            title={pveStrings.raid}
                            attr={"pveObj"}
                            value={this.props.value}
                            onChange={this.props.onChange}
                        />
                    </div>
                </div>

            </div>
        )
    }

}

export default SimulatorPanel