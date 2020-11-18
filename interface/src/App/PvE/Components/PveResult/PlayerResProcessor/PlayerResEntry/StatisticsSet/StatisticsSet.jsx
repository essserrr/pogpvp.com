import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import PlayerStatisticsWrapper from "./PlayerStatisticsWrapper/PlayerStatisticsWrapper";

import { getCookie } from "js/getCookie";
import { pveLocale } from "locale/Pve/CustomPve/CustomPve";

let pveStrings = new LocalizedStrings(pveLocale)

const StatisticsSet = React.memo(function StatisticsSet(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { value, disabled, ...other } = props;

    return (
        <Grid container>
            <Grid item xs={12}>
                <PlayerStatisticsWrapper
                    {...other}
                    value={value.avg}
                    title={`${pveStrings.playerAvg.avg}:`}
                    disableCollapse={disabled.avg}
                />
            </Grid>
            <Grid item xs={12}>
                <PlayerStatisticsWrapper
                    {...other}
                    value={value.max}
                    title={`${pveStrings.playerAvg.max}:`}
                    disableCollapse={disabled.max}
                />
            </Grid>
            <Grid item xs={12}>
                <PlayerStatisticsWrapper
                    {...other}
                    value={value.min}
                    title={`${pveStrings.playerAvg.min}:`}
                    disableCollapse={disabled.min}
                    onClick={props.onClick}
                    showCollapse={props.showCollapse}
                />
            </Grid>
        </Grid>
    )
});

export default StatisticsSet;

StatisticsSet.propTypes = {
    value: PropTypes.object,
    disabled: PropTypes.object,

    tables: PropTypes.object,
    snapshot: PropTypes.object,

    onClick: PropTypes.func,
    showCollapse: PropTypes.bool,
};