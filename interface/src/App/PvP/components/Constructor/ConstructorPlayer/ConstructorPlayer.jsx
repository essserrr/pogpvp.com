import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';

import Switch from "App/Components/Switch/Switch";
import WithIcon from "App/Components/WithIcon/WithIcon";
import Input from "App/Components/Input/Input";

import { constr } from "locale/Pvp/Constructor/Constructor";
import { getCookie } from "js/getCookie";

let constrStrings = new LocalizedStrings(constr);

const ConstructorPlayer = React.memo(function ConstructorPlayer(props) {
    constrStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { attr, pokName, label, onChange, children, shiledsDisabled, triggerDisabled } = props;

    return (
        <Grid container spacing={1}>

            <Grid item xs={12}>
                <WithIcon tip={pokName}>
                    <Input select name="Action" value={String(children.Action)}
                        attr={attr} label={label} onChange={onChange}>
                        {children.actionList}
                    </Input>
                </WithIcon>
            </Grid>


            <Grid item xs={12}>
                <Switch
                    checked={Boolean(children.IsShield)}
                    onChange={onChange}
                    name="IsShield"
                    attr={attr}
                    color="primary"
                    label={constrStrings.constructor.useshield}
                    disabled={shiledsDisabled}
                />
            </Grid>

            <Grid item xs={12}>
                <Switch
                    checked={Boolean(children.IsTriggered)}
                    onChange={onChange}
                    name="IsTriggered"
                    attr={attr}
                    color="primary"
                    label={constrStrings.constructor.trigger}
                    disabled={triggerDisabled}
                />
            </Grid>

        </Grid>
    )
});

export default ConstructorPlayer;

ConstructorPlayer.propTypes = {
    attr: PropTypes.string,
    pokName: PropTypes.string,
    label: PropTypes.string,

    onChange: PropTypes.func,

    children: PropTypes.object,

    shiledsDisabled: PropTypes.bool,
    triggerDisabled: PropTypes.bool,
};