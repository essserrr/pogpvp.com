import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import { getCookie } from "js/getCookie";
import { pveLocale } from "locale/Pve/CustomPve/CustomPve";

let pveStrings = new LocalizedStrings(pveLocale);

const PlayersImpact = React.memo(function PlayersImpact(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container>
            <Grid item xs={12}>
                {`${pveStrings.playerAvg.byPlayer}: `}
                {props.impact.map((value, key, array) => `${(value.dAvg / props.bossHP * 100).toFixed(1)}% (#${key + 1})${key !== array.length - 1 ? ", " : ""}`)}
            </Grid>
        </Grid>
    )
});

export default PlayersImpact;

PlayersImpact.propTypes = {
    bossHP: PropTypes.number,
    impact: PropTypes.array,
};