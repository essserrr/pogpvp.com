import React from "react";
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";

import LocalizedStrings from "react-localization";
import { stages } from "locale/Pvp/Stages/Stages";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(stages);
strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");


const Stages = React.memo(function Stages(props) {
    return (

        <WithIcon tip={strings.stagesTip}>
            <Grid container alignItems="center" wrap="nowrap">

                <Tooltip arrow placement="top" title={<Typography>{strings.atkStage}</Typography>}>
                    <Grid item xs>
                        <Input select name="AtkStage" value={props.Atk}
                            attr={props.attr} label={strings.atk} onChange={props.onChange}>

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
                    </Grid>
                </Tooltip>

                <Tooltip arrow placement="top" title={<Typography>{strings.defStage}</Typography>}>
                    <Grid item xs>
                        <Input select name="DefStage" value={props.Def}
                            attr={props.attr} label={strings.def} onChange={props.onChange}>

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
                    </Grid>
                </Tooltip>

            </Grid>
        </WithIcon>
    )
});

export default Stages;

Stages.propTypes = {
    Atk: PropTypes.number,
    Def: PropTypes.number,
    attr: PropTypes.string,
    onChange: PropTypes.func,
};