import React from "react";

import MenuItem from '@material-ui/core/MenuItem';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";

import LocalizedStrings from "react-localization";
import { pvp } from "../../../../locale/Pvp/Pvp"
import { getCookie } from "../../../../js/getCookie"

let strings = new LocalizedStrings(pvp);
strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


const Stages = React.memo(function (props) {
    return (

        <WithIcon tip={strings.tips.stages}>
            <Input select name="AtkStage" value={props.Atk}
                attr={props.attr} label={props.label} onChange={props.onChange}>

                <MenuItem value="4">4</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="0">0</MenuItem>
                <MenuItem value="-1">-1</MenuItem>
                <MenuItem value="-2">-2</MenuItem>
                <MenuItem value="-3">-3</MenuItem>
                <MenuItem value="-4">-4</MenuItem>

            </Input>
            <Input select name="DefStage" value={props.Def}
                attr={props.attr} label={props.label} onChange={props.onChange}>

                <MenuItem value="4">4</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="0">0</MenuItem>
                <MenuItem value="-1">-1</MenuItem>
                <MenuItem value="-2">-2</MenuItem>
                <MenuItem value="-3">-3</MenuItem>
                <MenuItem value="-4">-4</MenuItem>

            </Input>
        </WithIcon>
    )
});






export default Stages;