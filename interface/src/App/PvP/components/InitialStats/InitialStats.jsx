import React from "react";
import Input from "../Input/Input";
import ReactTooltip from "react-tooltip"
import LabelPrepend from "../SelectGroup/LabelPrepend"

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

const InitialStats = React.memo(function Pokemon(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <ReactTooltip effect='solid' />
            <div className="input-group input-group-sm mt-2">

                <LabelPrepend
                    label={props.label}

                    for={props.for}
                    tip={props.tip}
                    place={props.place}
                />

                <Input
                    name="InitialHP"
                    attr={props.attr}
                    value={props.InitialHP}
                    onChange={props.onChange}
                    place="HP"
                    tip={"HP: 0-" + strings.initialStats.hpTip + " HP"}
                />

                <Input
                    name="InitialEnergy"
                    attr={props.attr}
                    value={props.InitialEnergy}
                    onChange={props.onChange}
                    place={strings.initialStats.energy}
                    tip={strings.initialStats.energyTip + ": 0-100"}
                />
            </div>
        </>


    )

});

export default InitialStats;