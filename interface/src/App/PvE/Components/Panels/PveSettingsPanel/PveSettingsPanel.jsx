import React from "react"
import SelectGroup from "../../../../PvP/components/SelectGroup/SelectGroup"

import LocalizedStrings from "react-localization"
import { locale } from "../../../../../locale/locale"
import { pveLocale } from "../../../../../locale/pveLocale"
import { getCookie } from "../../../../../js/getCookie"

let strings = new LocalizedStrings(locale);
let pveStrings = new LocalizedStrings(pveLocale)

class PveSettingsPanel extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <div className="row mx-0 justify-content-center">
                <div className="col-12 px-0 my-1 text-center"><h5 className="fBolder m-0 p-0">{this.props.title}</h5></div>

                <div className="col-6 px-0 my-1 px-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="Weather"
                        value={this.props.value.Weather}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={<>
                            <option value="0" key="0">{pveStrings.weatherList[0]}</option>
                            <option value="1" key="1">{pveStrings.weatherList[1]}</option>
                            <option value="2" key="2">{pveStrings.weatherList[2]}</option>
                            <option value="3" key="3">{pveStrings.weatherList[3]}</option>
                            <option value="4" key="4">{pveStrings.weatherList[4]}</option>
                            <option value="5" key="5">{pveStrings.weatherList[5]}</option>
                            <option value="6" key="6">{pveStrings.weatherList[6]}</option>
                            <option value="7" key="7">{pveStrings.weatherList[7]}</option>
                        </>}

                        labelWidth="89px"
                        label={pveStrings.weather}

                        for={""}
                    />
                </div>
                <div className="col-6 px-0 my-1 px-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="FriendshipStage"
                        value={this.props.value.FriendshipStage}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={<>
                            <option value="0" key="0">{pveStrings.friendList.no}</option>
                            <option value="1" key="1">{pveStrings.friendList.good + " (3%)"}</option>
                            <option value="2" key="2">{pveStrings.friendList.great + " (5%)"}</option>
                            <option value="3" key="3">{pveStrings.friendList.ultra + " (7%)"}</option>
                            <option value="4" key="4">{pveStrings.friendList.best + " (10%)"}</option>
                            <option value="5" key="5">{pveStrings.friendList.good + " (6%)" + pveStrings.friendList.ev}</option>
                            <option value="6" key="6">{pveStrings.friendList.great + " (12%)" + pveStrings.friendList.ev}</option>
                            <option value="7" key="7">{pveStrings.friendList.ultra + " (18%)" + pveStrings.friendList.ev}</option>
                            <option value="8" key="8">{pveStrings.friendList.best + " (25%)" + pveStrings.friendList.ev}</option>
                        </>}

                        labelWidth="89px"
                        label={pveStrings.friend}

                        for={""}
                    />
                </div>

                {!this.props.forCustomPve && <div className="col-6 px-0 my-1 px-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="PlayersNumber"
                        value={this.props.value.PlayersNumber}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={<>
                            <option value="1" key="1">1</option>
                            <option value="2" key="2">2</option>
                            <option value="3" key="3">3</option>
                            <option value="4" key="4">4</option>
                            <option value="5" key="5">5</option>
                            <option value="6" key="6">6</option>
                            <option value="7" key="7">7</option>
                            <option value="8" key="8">8</option>
                            <option value="9" key="9">9</option>
                            <option value="10" key="10">10</option>
                            <option value="11" key="11">11</option>
                            <option value="12" key="12">12</option>
                            <option value="13" key="13">13</option>
                            <option value="14" key="14">14</option>
                            <option value="15" key="15">15</option>
                            <option value="16" key="16">16</option>
                            <option value="17" key="17">17</option>
                            <option value="18" key="18">18</option>
                            <option value="19" key="19">19</option>
                            <option value="20" key="20">20</option>
                        </>}

                        labelWidth="89px"
                        label={pveStrings.playernumb}


                        place={"top"}
                        for={"pvePlayersNumber"}

                        tip={pveStrings.playernumbTip}
                        tipClass="infoTip"
                    />
                </div>}
                <div className="col-6 px-0 my-1 px-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="PartySize"
                        value={this.props.value.PartySize}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={<>
                            <option value="6" key="6">{"6 (1 " + pveStrings.party + ")"}</option>
                            <option value="12" key="12">{"12 (2 " + pveStrings.parties + ")"}</option>
                            <option value="18" key="18">{"18 (3 " + pveStrings.parties + ")"}</option>
                        </>}

                        labelWidth="89px"
                        label={pveStrings.partysize}

                        place={"top"}
                        for={"partySizeTips"}
                        tip={pveStrings.sizetip}
                        tipClass="infoTip"
                    />
                </div>
                <div className="col-6 px-0  my-1 px-1">
                    <SelectGroup
                        class="input-group input-group-sm"

                        name="DodgeStrategy"
                        value={this.props.value.DodgeStrategy}
                        attr={this.props.attr}
                        onChange={this.props.onChange}
                        options={<>
                            <option value="0" key="0">{pveStrings.dodgeList}</option>
                            <option value="1" key="1">25%</option>
                            <option value="2" key="2">50%</option>
                            <option value="3" key="3">75%</option>
                            <option value="4" key="4">100%</option>
                        </>}

                        labelWidth="89px"
                        label={pveStrings.dodge}


                        place={"top"}
                        for={"pveDodgeStrategy"}

                        tip={pveStrings.dodgetip}
                        tipClass="infoTip"
                    />
                </div>




            </div>
        )
    }

}

export default PveSettingsPanel