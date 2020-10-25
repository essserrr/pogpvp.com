import React from "react"
import LocalizedStrings from "react-localization"

import LabelAndInput from "../../LabelAndInput/LabelAndInput"
import SelectGroup from "../../../../PvP/components/SelectGroup/SelectGroup"

import { getCookie } from "../../../../../js/getCookie"
import { userLocale } from "../../../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale)

class PvpForm extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <>
                <div className="col-12 px-0 py-1 text-center font-weight-bold">{strings.moveconstr.pvp.title}</div>
                <div className="col-12 p-0 ">
                    <LabelAndInput
                        labelWidth="125px"
                        label={strings.moveconstr.pvp.d}
                        lTip={strings.moveconstr.pvp.tips.d}

                        attr={"pvp"}
                        name={"PvpDamage"}

                        value={this.props.PvpDamage}
                        notOk={this.props.notOk.PvpDamage}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0 pt-2">
                    <LabelAndInput
                        labelWidth="125px"
                        label={strings.moveconstr.pvp.e}
                        lTip={strings.moveconstr.pvp.tips.e}

                        attr={"pvp"}
                        name={"PvpEnergy"}

                        value={this.props.PvpEnergy}
                        notOk={this.props.notOk.PvpEnergy}

                        type={"text"}

                        onChange={this.props.onChange}
                    />
                </div>
                <div className="col-12 p-0">
                    {this.props.moveCategory === "Fast Move" && <SelectGroup
                        labelWidth="125px"
                        label={strings.moveconstr.pvp.cd}

                        attr={"pvp"}
                        name="PvpDurationSeconds"

                        options={<>
                            <option value="0.5" >1</option>
                            <option value="1" >2</option>
                            <option value="1.5" >3</option>
                            <option value="2" >4</option>
                        </>}
                        value={this.props.PvpDurationSeconds}

                        onChange={this.props.onChange}

                        place={"top"}
                        for={"PvpDurationSeconds"}
                        tip={strings.moveconstr.pvp.tips.cd}
                        tipClass="infoTip"
                    />}
                </div>
                {this.props.moveCategory === "Charge Move" && <>
                    <div className="col-12 p-0 pt-2">
                        <LabelAndInput
                            labelWidth="125px"
                            label={strings.moveconstr.pvp.prob}
                            lTip={strings.moveconstr.pvp.tips.prob}

                            attr={"pvp"}
                            name={"Probability"}

                            value={this.props.Probability}
                            notOk={this.props.notOk.Probability}

                            type={"text"}

                            onChange={this.props.onChange}
                        />
                    </div>
                    <div className="col-12 p-0">
                        <SelectGroup
                            labelWidth="125px"
                            label={strings.moveconstr.pvp.stat}

                            attr={"pvp"}
                            name="Stat"

                            options={<>
                                <option value="" >{strings.moveconstr.statopt.n}</option>
                                <option value="Atk" >{strings.moveconstr.statopt.a}</option>
                                <option value="Def" >{strings.moveconstr.statopt.d}</option>
                                <option value="Atk,Def" >{strings.moveconstr.statopt.ad}</option>
                            </>}
                            value={this.props.Stat}

                            onChange={this.props.onChange}

                            place={"top"}
                            for={"Stat"}
                            tip={strings.moveconstr.pvp.tips.stat}
                            tipClass="infoTip"
                        />
                    </div>
                    <div className="col-12 p-0">
                        <SelectGroup
                            labelWidth="125px"
                            label={strings.moveconstr.pvp.stage}

                            attr={"pvp"}
                            name="StageDelta"

                            options={<>
                                <option value="-4" >-4</option>
                                <option value="-3" >-3</option>
                                <option value="-2" >-2</option>
                                <option value="-1" >-1</option>
                                <option value="0" >0</option>
                                <option value="1" >1</option>
                                <option value="2" >2</option>
                                <option value="3" >3</option>
                                <option value="4" >4</option>

                            </>}
                            value={this.props.StageDelta}

                            onChange={this.props.onChange}

                            place={"top"}
                            for={"StageDelta"}
                            tip={strings.moveconstr.pvp.tips.stage}
                            tipClass="infoTip"
                        />
                    </div>
                    <div className="col-12 p-0">
                        <SelectGroup
                            labelWidth="125px"
                            label={strings.moveconstr.pvp.subj}

                            attr={"pvp"}
                            name="Subject"

                            options={<>
                                <option value="" >{strings.moveconstr.subjopt.n}</option>
                                <option value="Opponent" >{strings.moveconstr.subjopt.o}</option>
                                <option value="Self" >{strings.moveconstr.subjopt.s}</option>
                            </>}
                            value={this.props.Subject}

                            onChange={this.props.onChange}

                            place={"top"}
                            for={"Subject"}
                            tip={strings.moveconstr.pvp.tips.subj}
                            tipClass="infoTip"
                        />
                    </div>
                </>}
            </>
        );
    }
}

export default PvpForm
