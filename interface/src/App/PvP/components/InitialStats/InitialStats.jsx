import React from "react";
import Input from "../Input/Input";
import ReactTooltip from "react-tooltip"

import WithIcon from "App/Components/WithIcon/WithIcon";

import LocalizedStrings from "react-localization";
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(locale);

const InitialStats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <WithIcon tip={strings.initialStats.tip}>

            <div className="input-group input-group-sm mt-2">
                <ReactTooltip
                    className={"infoTip"}
                    id={props.attr + "InitialHP"} effect="solid">
                    {"HP: 0-" + strings.initialStats.hpTip + " HP"}
                </ReactTooltip>
                <ReactTooltip
                    className={"infoTip"}
                    id={props.attr + "InitialEnergy"} effect="solid">
                    {strings.initialStats.energyTip + ": 0-100"}
                </ReactTooltip>
                <Input
                    label={props.label}
                    name="InitialHP"
                    attr={props.attr}
                    value={props.InitialHP}
                    onChange={props.onChange}
                    place="HP"
                    for={props.attr + "InitialHP"}
                />

                <Input
                    label={props.label}
                    name="InitialEnergy"
                    attr={props.attr}
                    value={props.InitialEnergy}
                    onChange={props.onChange}
                    place={strings.initialStats.energy}
                    for={props.attr + "InitialEnergy"}
                />
            </div>
        </WithIcon>
    )

});

export default InitialStats;