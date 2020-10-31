import React from "react"

import ReactTooltip from "react-tooltip"

import LocalizedStrings from "react-localization"
import { locale } from "../../../../locale/locale"
import { getCookie } from "../../../../js/getCookie"

import Grid from '@material-ui/core/Grid';
import Input from 'App/Components/Input/Input';

import "./Stats.scss"

let strings = new LocalizedStrings(locale)

const Stats = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            {/*<ReactTooltip
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
            </ReactTooltip>*/}
            <Grid container >
                <Grid item xs >
                    <Input
                        label={strings.stats.lvl}
                        name="Lvl"
                        attr={props.attr}
                        value={props.Lvl}
                        onChange={props.onChange}
                    />
                </Grid>
                <Grid item xs >
                    <Input
                        name="Atk"
                        attr={props.attr}
                        value={props.Atk}
                        onChange={props.onChange}
                        label={strings.effStats.atk}
                    />
                </Grid>
                <Grid item xs >
                    <Input
                        name="Def"
                        attr={props.attr}
                        value={props.Def}
                        onChange={props.onChange}
                        label={strings.effStats.def}
                    />
                </Grid>
                <Grid item xs >
                    <Input
                        name="Sta"
                        attr={props.attr}
                        value={props.Sta}
                        onChange={props.onChange}
                        label={strings.effStats.sta}
                    />
                </Grid>
            </Grid>
        </>
    )

});

export default Stats;