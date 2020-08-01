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
                <div className="col-12 px-0 pt-2 text-center">PvP stats</div>
                <div className="col-12 p-0 ">
                    <LabelAndInput
                        label={"Damage"}
                        lTip={"Damage"}

                        attr={"pve"}
                        name={"damage"}
                        place={"Damage"}

                        value={this.props.damage}
                        notOk={this.props.notOk.damage}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    {this.props.moveCategory === "Fast Move" ?
                        <LabelAndInput
                            label={"Energy"}
                            lTip={"Energy"}

                            attr={"pve"}
                            name={"energy"}
                            place={"Energy"}

                            value={this.props.energy}
                            notOk={this.props.notOk.energy}

                            type={"text"}

                            onChange={this.props.onChange}
                        /> :
                        <SelectGroup
                            label={"Energy"}

                            attr={"pve"}
                            name="energy"

                            options={<>
                                <option value="-33" >-33</option>
                                <option value="-50" >-50</option>
                                <option value="-100" >-100</option>
                            </>}
                            value={this.props.energy}

                            onChange={this.props.onChange}

                            place={"top"}
                            for={"pveenergy"}
                            tip={"Energy"}
                            tipClass="infoTip"
                        />}
                </div>
                <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        label={"Cooldown"}
                        lTip={"Cooldown"}

                        attr={"pve"}
                        name={"cooldown"}
                        place={"Cooldown"}

                        value={this.props.cooldown}
                        notOk={this.props.notOk.cooldown}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        label={"Damage window"}
                        lTip={"Damage window"}

                        attr={"pve"}
                        name={"damageWindow"}
                        place={"Damage window"}

                        value={this.props.damageWindow}
                        notOk={this.props.notOk.damageWindow}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        label={"Dodge window"}
                        lTip={"Dodge window"}

                        attr={"pve"}
                        name={"dodgeWindow"}
                        place={"Dodge window"}

                        value={this.props.dodgeWindow}
                        notOk={this.props.notOk.dodgeWindow}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
            </>
        );
    }
}

export default PveForm
