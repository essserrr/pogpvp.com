import React from "react"
import LocalizedStrings from "react-localization"

import SelectGroup from "../../../../PvP/components/SelectGroup/SelectGroup"
import PvePokemon from "../../PvePokemon"
import Checkbox from "../../../../RaidsList/Checkbox/Checkbox"

import { locale } from "../../../../../locale/locale"
import { pveLocale } from "../../../../../locale/pveLocale"
import { getCookie } from "../../../../../js/getCookie"

let strings = new LocalizedStrings(locale)
let pveStrings = new LocalizedStrings(pveLocale)

class PokemonPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0 justify-content-center align-items-center">
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
                {this.props.canBeShadow && <div className="col-6 px-0 pr-1 my-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="IsShadow"
                        value={this.props.value[this.props.attr].IsShadow}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={
                            <>
                                <option value="false" key="Normal">{strings.options.type.normal}</option>
                                <option value="true" key="Shadow">{strings.options.type.shadow}</option>
                            </>}

                        labelWidth="88px"
                        label={strings.title.type}

                        place={"top"}
                        for={this.props.attr + "attackerIsShadow"}

                        tip={strings.tips.shadow}
                        tipClass="infoTip"
                    />
                </div>}
                {this.props.canBeShadow && this.props.attr !== "bossObj" && <div className="col-6 px-0 pl-1 my-1">
                    <Checkbox
                        class={"form-check form-check-inline m-0 p-0"}
                        checked={this.props.value.pveObj.SupportSlotEnabled !== "false" ? "checked" : false}
                        attr={"pveObj"}
                        name={"SupportSlotEnabled"}
                        label={
                            <div className=" text-center">
                                {pveStrings.supen}
                            </div>
                        }
                        onChange={this.props.onChange}
                    />
                </div>}
            </div>
        )
    }

}

export default PokemonPanel