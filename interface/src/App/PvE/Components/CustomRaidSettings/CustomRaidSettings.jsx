import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import PanelWithTitle from "App/PvE/Components/Panels/PanelWithTitle";
import GroupsSettings from "./GroupsSettings/GroupsSettings";
import CollectionSettings from "./CollectionSettings/CollectionSettings";
import DoubleSlider from "App/Movedex/MoveCard/DoubleSlider/DoubleSlider";

import { settings } from "locale/Pve/Settings/Settings";
import { getCookie } from "js/getCookie";


let pveStrings = new LocalizedStrings(settings);

const CustomRaidSettings = React.memo(function CustomRaidSettings(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (

        <PanelWithTitle title={props.title}>
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <DoubleSlider
                        onClick={props.onChange}

                        attrs={["userCollection", "userGroups"]}
                        titles={[pveStrings.selfFromColl, pveStrings.selfFromGtoup]}
                        active={[Boolean(props.value.FindInCollection), !props.value.FindInCollection]}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={props.value.FindInCollection} unmountOnExit>
                        <CollectionSettings
                            attr={props.attr}

                            value={props.value.SortByDamage}
                            settingsValue={props.settingsValue}

                            onChange={props.onChange}
                        />
                    </Collapse>
                </Grid>

                <Grid item xs={12}>
                    <Collapse in={!props.value.FindInCollection} unmountOnExit>
                        <GroupsSettings
                            attr={props.attr}

                            userParties={props.userParties}
                            value={props.value.UserPlayers}

                            onChange={props.onChange}
                        />
                    </Collapse>
                </Grid>

            </Grid>
        </PanelWithTitle>
    )
});


export default CustomRaidSettings;

CustomRaidSettings.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    attr: PropTypes.string,
    settingsValue: PropTypes.object,
    value: PropTypes.object.isRequired,

    userParties: PropTypes.object,
    onChange: PropTypes.func,
};