import React from "react";
import Input from "../Input/Input";
import ReactTooltip from "react-tooltip"

import LocalizedStrings from 'react-localization';
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/indexFunctions"

let strings = new LocalizedStrings(locale);

const Stats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <div className={props.class ? props.class : "font95 input-group input-group-sm mt-1 mb-2"} >
            <ReactTooltip
                id={props.attr + "inlvl"} effect='solid'>
                {strings.stats.lvl + ": 1-45"}
            </ReactTooltip>
            <ReactTooltip
                id={props.attr + "inatk"} effect='solid'>
                {strings.effStats.atk + " IV: 0-15"}
            </ReactTooltip>
            <ReactTooltip
                id={props.attr + "indef"} effect='solid'>
                {strings.effStats.def + " IV: 0-15"}
            </ReactTooltip>
            <ReactTooltip
                id={props.attr + "insta"} effect='solid'>
                {strings.effStats.sta + " IV: 0-15"}
            </ReactTooltip>

            <Input
                name="Lvl"
                attr={props.attr}
                value={props.Lvl}
                onChange={props.onChange}
                place={strings.stats.lvl}
                for={props.attr + "inlvl"}
            />
            <Input
                name="Atk"
                attr={props.attr}
                value={props.Atk}
                onChange={props.onChange}
                place={strings.effStats.atk}
                for={props.attr + "inatk"}
            />
            <Input
                name="Def"
                attr={props.attr}
                value={props.Def}
                onChange={props.onChange}
                place={strings.effStats.def}
                for={props.attr + "indef"}
            />
            <Input
                name="Sta"
                attr={props.attr}
                value={props.Sta}
                onChange={props.onChange}
                place={strings.effStats.sta}
                for={props.attr + "insta"}
            />
        </div>
    )

});

export default Stats;