import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import Input from "App/Components/Input/Input";
import WithIcon from "App/Components/WithIcon/WithIcon";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomMoves/CustomMoves";

let strings = new LocalizedStrings(userLocale)

const PvpProperties = React.memo(function PvpProperties(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { PvpDamage, PvpEnergy, PvpDurationSeconds, Probability, Stat, StageDelta, Subject, moveCategory, onChange, ...other } = props;

    return (
        <Grid container justify="center" {...other}>
            <Grid item xs={12}>
                <Typography align="center">
                    <b>{strings.moveconstr.pvp.title}</b>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <WithIcon tip={strings.moveconstr.pvp.tips.d}>
                    <Input
                        label={strings.moveconstr.pvp.d}
                        name="PvpDamage"
                        type="text"

                        value={PvpDamage.value}
                        errorText={PvpDamage.error}

                        onChange={props.onChange}
                    />
                </WithIcon>
            </Grid>
            <Grid item xs={12}>
                <WithIcon tip={strings.moveconstr.pvp.tips.e}>
                    <Input
                        label={strings.moveconstr.pvp.e}
                        name="PvpEnergy"
                        type="text"

                        value={PvpEnergy.value}
                        errorText={PvpEnergy.error}

                        onChange={props.onChange}
                    />
                </WithIcon>
            </Grid>
            <Grid item xs={12}>
                {props.moveCategory === "Fast Move" &&
                    <WithIcon tip={strings.moveconstr.pvp.tips.cd}>
                        <Input
                            label={strings.moveconstr.pvp.cd}
                            select

                            name="PvpDurationSeconds"
                            value={PvpDurationSeconds.value}

                            onChange={props.onChange}
                        >
                            <MenuItem value="0.5" >1</MenuItem>
                            <MenuItem value="1" >2</MenuItem>
                            <MenuItem value="1.5" >3</MenuItem>
                            <MenuItem value="2" >4</MenuItem>
                        </Input>
                    </WithIcon>}
            </Grid>
            {props.moveCategory === "Charge Move" && <>
                <Grid item xs={12}>
                    <WithIcon tip={strings.moveconstr.pvp.tips.prob}>
                        <Input
                            label={strings.moveconstr.pvp.prob}
                            name="Probability"
                            type="text"

                            value={Probability.value}
                            errorText={Probability.error}

                            onChange={props.onChange}
                        />
                    </WithIcon>
                </Grid>
                <Grid item xs={12}>

                    <WithIcon tip={strings.moveconstr.pvp.tips.stat}>
                        <Input
                            label={strings.moveconstr.pvp.stat}
                            select

                            name="Stat"
                            value={Stat.value}

                            onChange={props.onChange}
                        >
                            <MenuItem value="" >{strings.moveconstr.statopt.n}</MenuItem>
                            <MenuItem value="Atk" >{strings.moveconstr.statopt.a}</MenuItem>
                            <MenuItem value="Def" >{strings.moveconstr.statopt.d}</MenuItem>
                            <MenuItem value="Atk,Def" >{strings.moveconstr.statopt.ad}</MenuItem>
                        </Input>
                    </WithIcon>
                </Grid>
                <Grid item xs={12}>
                    <WithIcon tip={strings.moveconstr.pvp.tips.stage}>
                        <Input
                            label={strings.moveconstr.pvp.stage}
                            select

                            name="StageDelta"
                            value={StageDelta.value}

                            onChange={props.onChange}
                        >
                            <MenuItem value="-4" >-4</MenuItem>
                            <MenuItem value="-3" >-3</MenuItem>
                            <MenuItem value="-2" >-2</MenuItem>
                            <MenuItem value="-1" >-1</MenuItem>
                            <MenuItem value="0" >0</MenuItem>
                            <MenuItem value="1" >1</MenuItem>
                            <MenuItem value="2" >2</MenuItem>
                            <MenuItem value="3" >3</MenuItem>
                            <MenuItem value="4" >4</MenuItem>
                        </Input>
                    </WithIcon>
                </Grid>
                <Grid item xs={12}>
                    <WithIcon tip={strings.moveconstr.pvp.tips.subj}>
                        <Input
                            label={strings.moveconstr.pvp.subj}
                            select

                            name="Subject"
                            value={Subject.value}

                            onChange={props.onChange}
                        >
                            <MenuItem value="" >{strings.moveconstr.subjopt.n}</MenuItem>
                            <MenuItem value="Opponent" >{strings.moveconstr.subjopt.o}</MenuItem>
                            <MenuItem value="Self" >{strings.moveconstr.subjopt.s}</MenuItem>
                        </Input>
                    </WithIcon>
                </Grid>
            </>}
        </Grid>
    )
});

export default PvpProperties;

PvpProperties.propTypes = {
    PvpDamage: PropTypes.object,
    PvpEnergy: PropTypes.object,
    PvpDurationSeconds: PropTypes.object,
    Probability: PropTypes.object,
    Stat: PropTypes.object,
    StageDelta: PropTypes.object,
    Subject: PropTypes.object,
    moveCategory: PropTypes.string,

    onChange: PropTypes.func,
};
