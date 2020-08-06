import React from "react"
import LocalizedStrings from "react-localization"

import LabelAndInput from "../LabelAndInput/LabelAndInput"
import SelectGroup from "../../../PvP/components/SelectGroup/SelectGroup"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale)

class PveForm extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <>
                <div className="col-12 px-0 py-1 text-center font-weight-bold">{strings.moveconstr.pve.title}</div>
                <div className="col-12 p-0 ">
                    <LabelAndInput
                        label={strings.moveconstr.pve.d}
                        lTip={strings.moveconstr.pve.tips.d}

                        attr={"pve"}
                        name={"Damage"}

                        value={this.props.Damage}
                        notOk={this.props.notOk.Damage}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                {this.props.moveCategory === "Fast Move" && <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        label={strings.moveconstr.pve.e}
                        lTip={strings.moveconstr.pve.tips.e}

                        attr={"pve"}
                        name={"Energy"}

                        value={this.props.Energy}
                        notOk={this.props.notOk.Energy}

                        type={"text"}

                        onChange={this.props.onChange}
                    /></div>}
                {this.props.moveCategory === "Charge Move" && <div className="col-12 p-0">
                    <SelectGroup
                        label={strings.moveconstr.pve.e}

                        attr={"pve"}
                        name="Energy"

                        options={<>
                            <option value="-33" >-33</option>
                            <option value="-50" >-50</option>
                            <option value="-100" >-100</option>
                        </>}
                        value={this.props.Energy}

                        onChange={this.props.onChange}

                        place={"top"}
                        for={"pveenergych"}
                        tip={strings.moveconstr.pve.tips.e}
                        tipClass="infoTip"
                    /></div>}

                <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        label={strings.moveconstr.pve.cd}
                        lTip={strings.moveconstr.pve.tips.cd}

                        attr={"pve"}
                        name={"Cooldown"}

                        value={this.props.Cooldown}
                        notOk={this.props.notOk.Cooldown}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        label={strings.moveconstr.pve.dmgwd}
                        lTip={strings.moveconstr.pve.tips.dmgwd}

                        attr={"pve"}
                        name={"DamageWindow"}

                        value={this.props.DamageWindow}
                        notOk={this.props.notOk.DamageWindow}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        label={strings.moveconstr.pve.dwd}
                        lTip={strings.moveconstr.pve.tips.dwd}

                        attr={"pve"}
                        name={"DodgeWindow"}

                        value={this.props.DodgeWindow}
                        notOk={this.props.notOk.DodgeWindow}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
            </>
        );
    }
}

export default PveForm
