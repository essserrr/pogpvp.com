import React from "react"
import Input from "../Input/Input"
import ReactTooltip from "react-tooltip"

import LocalizedStrings from "react-localization"
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

import "./Stats.scss"

let strings = new LocalizedStrings(locale)

const Stats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            <ReactTooltip
                className={"infoTip"}
                id={props.attr + "inlvl"} effect="solid">
                {strings.stats.lvl + ": 1-45"}
            </ReactTooltip>
            <ReactTooltip
                className={"infoTip"}
                id={props.attr + "inatk"} effect="solid">
                {strings.effStats.atk + " IV: 0-15"}
            </ReactTooltip>
            <ReactTooltip
                className={"infoTip"}
                id={props.attr + "indef"} effect="solid">
                {strings.effStats.def + " IV: 0-15"}
            </ReactTooltip>
            <ReactTooltip
                className={"infoTip"}
                id={props.attr + "insta"} effect="solid">
                {strings.effStats.sta + " IV: 0-15"}
            </ReactTooltip>
            <div className={`stats input-group input-group-sm ${props.class ? props.class : "mt-1 mb-2"}`} >
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
        </>
    )

});

export default Stats;