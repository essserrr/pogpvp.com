import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import { getCookie } from "js/getCookie";
import { remain } from "locale/Components/HPRemaining/HPRemaining";

let pveStrings = new LocalizedStrings(remain);

const HpRemaining = React.memo(function HpRemaining(props) {
    pveStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <Typography varinat="body2">

            {`${pveStrings.hprem}${props.avg}`}

            {(props.max !== undefined && props.min !== undefined) && ` (${props.max}-${props.min})`}

            {props.nbOfWins > 0 && <b>{` ${pveStrings.winrate} ${props.nbOfWins}%`}</b>}

        </Typography>
    )
});

export default HpRemaining;

HpRemaining.propTypes = {
    avg: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    nbOfWins: PropTypes.string,
};