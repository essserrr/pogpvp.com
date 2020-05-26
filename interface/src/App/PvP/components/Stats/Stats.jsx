import React from "react";
import Input from "../Input/Input";

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

const Stats = React.memo(function Pokemon(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className="font95 input-group input-group-sm mt-1 mb-2" >
            <Input
                name="Lvl"
                attr={props.attr}
                value={props.Lvl}
                onChange={props.onChange}
                place={strings.stats.lvl}
                tip={strings.stats.lvl + ": 1-45"}
            />
            <Input
                name="Atk"
                attr={props.attr}
                value={props.Atk}
                onChange={props.onChange}
                place={strings.effStats.atk}
                tip={strings.effStats.atk + " IV: 0-15"}
            />
            <Input
                name="Def"
                attr={props.attr}
                value={props.Def}
                onChange={props.onChange}
                place={strings.effStats.def}
                tip={strings.effStats.def + " IV: 0-15"}
            />
            <Input
                name="Sta"
                attr={props.attr}
                value={props.Sta}
                onChange={props.onChange}
                place={strings.effStats.sta}
                tip={strings.effStats.sta + " IV: 0-15"}
            />
        </div>
    )

});

export default Stats;