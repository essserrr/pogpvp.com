import React from "react";
import Input from "../Input/Input";
import ReactTooltip from "react-tooltip"
import LabelPrepend from "../SelectGroup/LabelPrepend"

import LocalizedStrings from "react-localization";
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(locale);

const InitialStats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
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
            <div className="input-group input-group-sm mt-2">
                <LabelPrepend
                    label={props.label}
                    tipClass="infoTip"
                    for={props.attr + "instats"}
                    place={"top"}
                    tip={strings.initialStats.tip}
                />

                <Input
                    name="InitialHP"
                    attr={props.attr}
                    value={props.InitialHP}
                    onChange={props.onChange}
                    place="HP"
                    for={props.attr + "InitialHP"}
                />

                <Input
                    name="InitialEnergy"
                    attr={props.attr}
                    value={props.InitialEnergy}
                    onChange={props.onChange}
                    place={strings.initialStats.energy}
                    for={props.attr + "InitialEnergy"}
                />
            </div>
        </>
    )

});

export default InitialStats;