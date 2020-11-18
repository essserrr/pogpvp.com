import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Stat from "./Stat/Stat";
import { stats } from "locale/Components/Stats/locale"
import { getCookie } from "js/getCookie"

let strings = new LocalizedStrings(stats);

const EffectiveStats = React.memo(function EffectiveStats(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="space-between" alignItems="center" wrap="nowrap">

            <Stat tip={strings.atkTip} title={strings.atk} stage={props.AtkStage} children>{props.effAtk}</Stat>

            <Stat tip={strings.defTip} title={strings.def} stage={props.DefStage} children>{props.effDef}</Stat>

            <Stat tip={strings.staTip} title={strings.sta} stage={0} children>{props.effSta}</Stat>

        </Grid>
    )
});

export default EffectiveStats;

EffectiveStats.propTypes = {
    effAtk: PropTypes.number,
    effDef: PropTypes.number,
    effSta: PropTypes.number,
    AtkStage: PropTypes.number,
    DefStage: PropTypes.number,
    attr: PropTypes.string,
};