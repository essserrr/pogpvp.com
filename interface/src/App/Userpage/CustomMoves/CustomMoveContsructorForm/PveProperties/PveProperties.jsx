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

const PveProperties = React.memo(function PveProperties(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { DodgeWindow, DamageWindow, Cooldown, Energy, Damage, moveCategory, onChange, ...other } = props;

    return (
        <Grid container justify="center" {...other}>
            <Grid item xs={12}>
                <Typography align="center">
                    <b>{strings.moveconstr.pve.title}</b>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <WithIcon tip={strings.moveconstr.pve.tips.d}>
                    <Input
                        label={strings.moveconstr.pve.d}
                        name="Damage"
                        type="text"

                        value={Damage.value}
                        errorText={Damage.error}

                        onChange={props.onChange}
                    />
                </WithIcon>
            </Grid>
            {props.moveCategory === "Fast Move" &&
                <Grid item xs={12}>
                    <WithIcon tip={strings.moveconstr.pve.tips.e}>
                        <Input
                            label={strings.moveconstr.pve.e}
                            type={"text"}
                            name={"Energy"}

                            value={Energy.value}
                            errorText={Energy.error}

                            onChange={props.onChange}
                        />
                    </WithIcon>
                </Grid>}
            {props.moveCategory === "Charge Move" &&
                <Grid item xs={12}>
                    <WithIcon tip={strings.moveconstr.pve.tips.e}>
                        <Input
                            label={strings.moveconstr.pve.e}
                            select

                            name="Energy"
                            value={Energy.value}

                            onChange={props.onChange}
                        >
                            <MenuItem value="-33">-33</MenuItem>
                            <MenuItem value="-50">-50</MenuItem>
                            <MenuItem value="-100">-100</MenuItem>
                        </Input>
                    </WithIcon>
                </Grid>}

            <Grid item xs={12}>
                <WithIcon tip={strings.moveconstr.pve.tips.cd}>
                    <Input
                        label={strings.moveconstr.pve.cd}
                        name={"Cooldown"}
                        type={"text"}

                        value={Cooldown.value}
                        errorText={Cooldown.error}

                        onChange={props.onChange}
                    />
                </WithIcon>
            </Grid>
            <Grid item xs={12}>
                <WithIcon tip={strings.moveconstr.pve.tips.dmgwd}>
                    <Input
                        label={strings.moveconstr.pve.dmgwd}
                        name={"DamageWindow"}
                        type={"text"}

                        value={DamageWindow.value}
                        errorText={DamageWindow.error}

                        onChange={props.onChange}
                    />
                </WithIcon>
            </Grid>
            <Grid item xs={12}>
                <WithIcon tip={strings.moveconstr.pve.tips.dwd}>
                    <Input
                        label={strings.moveconstr.pve.dwd}
                        name={"DodgeWindow"}
                        type={"text"}

                        value={DodgeWindow.value}
                        errorText={DodgeWindow.error}

                        onChange={props.onChange}
                    />
                </WithIcon>
            </Grid>
        </Grid>
    )
});

export default PveProperties;

PveProperties.propTypes = {
    DodgeWindow: PropTypes.object,
    DamageWindow: PropTypes.object,
    Cooldown: PropTypes.object,
    Energy: PropTypes.object,
    Damage: PropTypes.object,
    moveCategory: PropTypes.string,

    onChange: PropTypes.func,
};