import React from "react"
import LocalizedStrings from "react-localization"

import SelectGroup from "../../../../PvP/components/SelectGroup/SelectGroup"
import Stats from "../../../../PvP/components/Stats/Stats"
import Input from "../../../../PvP/components/Input/Input"

import { getCookie } from "../../../../../js/getCookie"
import { userLocale } from "../../../../../locale/userLocale"
import { locale } from "../../../../../locale/locale"

let strings = new LocalizedStrings(userLocale)
let pvpStrings = new LocalizedStrings(locale)

class Filters extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pvpStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0">
                <div className="col-6 col-lg-4 px-1 my-1">
                    <Input
                        attr={this.props.attr}
                        name={"Name"}
                        value={this.props.value.Name}

                        onChange={this.props.onChange}
                        place={strings.userpok.pokname}
                    />
                </div>
                <div className="col-6 col-lg-4 px-1 my-1">
                    <Input
                        attr={this.props.attr}
                        name={"QuickMove"}
                        value={this.props.value.QuickMove}

                        onChange={this.props.onChange}
                        place={strings.userpok.qname}
                    />
                </div>
                <div className="col-6 col-lg-4 px-1 my-1">
                    <Input
                        attr={this.props.attr}
                        name={"ChargeMove"}
                        value={this.props.value.ChargeMove}

                        onChange={this.props.onChange}
                        place={strings.userpok.chname}
                    />
                </div>
                <div className="col-6 col-lg-4 px-1 my-1">
                    <Stats
                        class=" "

                        Lvl={this.props.value.Lvl}
                        Atk={this.props.value.Atk}
                        Def={this.props.value.Def}
                        Sta={this.props.value.Sta}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-6 col-lg-4 px-1 my-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="IsShadow"
                        value={this.props.value.IsShadow}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={
                            <>
                                <option value="" key="None"></option>
                                <option value="false" key="Normal">{pvpStrings.options.type.normal}</option>
                                <option value="true" key="Shadow">{pvpStrings.options.type.shadow}</option>
                            </>}

                        labelWidth="88px"
                        label={pvpStrings.title.type}

                        place={"top"}
                        for={this.props.attr + "attackerIsShadow"}

                        tip={pvpStrings.tips.shadow}
                        tipClass="infoTip"
                    />
                </div>
            </div>
        );
    }
}

export default Filters

