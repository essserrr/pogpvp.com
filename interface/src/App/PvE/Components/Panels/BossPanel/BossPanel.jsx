import React from "react"
import SelectGroup from "../../../../PvP/components/SelectGroup/SelectGroup"
import PvePokemon from "../../PvePokemon"

import LocalizedStrings from "react-localization"
import { locale } from "../../../../../locale/locale"
import { pveLocale } from "../../../../../locale/pveLocale"
import { getCookie } from "../../../../../js/getCookie"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale)

class BossPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0 justify-content-center">
                <div className="col-12 px-0 text-center my-1"><h5 className="fBolder m-0 p-0">{this.props.title}</h5></div>
                <div className="col-12 px-0">
                    <PvePokemon
                        attr={this.props.attr}

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

                <div className="col-6 px-0  my-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="IsAggresive"
                        value={this.props.settingsValue.IsAggresive}
                        attr="pveObj"
                        onChange={this.props.onChange}
                        options={
                            <>
                                <option value="false" key="Normal">{pveStrings.aggrList.norm}</option>
                                <option value="true" key="Aggresive">{pveStrings.aggrList.aggr}</option>
                            </>
                        }

                        labelWidth="88px"
                        label={pveStrings.aggreasive}


                        place={"top"}
                        for={"bossIsAggresive"}

                        tip={pveStrings.aggresivetip}
                        tipClass="infoTip"
                    />
                </div>
            </div>
        )
    }

}

export default BossPanel