import React from "react"
import SelectGroup from "../../../../PvP/components/SelectGroup/SelectGroup"
import PvePokemon from "../../PvePokemon"

import LocalizedStrings from "react-localization"
import { locale } from "../../../../../locale/locale"
import { getCookie } from "../../../../../js/getCookie"

let strings = new LocalizedStrings(locale);

class PokemonPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
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
                {this.props.canBeShadow && <div className="col-6 px-0  my-1">
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
            </div>
        )
    }

}

export default PokemonPanel