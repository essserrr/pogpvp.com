import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { AiTwotoneThunderbolt } from 'react-icons/ai';

import { getCookie } from "js/getCookie";
import { instats } from "locale/Pvp/InitialStats/InitialStats";

let strings = new LocalizedStrings(instats);

const EnergyNumber = React.memo(function EnergyNumber(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    const value = typeof props.value === "number" ? (props.value <= 100 ? props.value : 100) : 0;
    return (
        <Tooltip arrow placement="top" title={<Typography>{strings.energy}</Typography>}>
            <Box fontWeight="bold" style={{ cursor: "pointer" }} display="flex" alignItems="center">
                <AiTwotoneThunderbolt />
                {value}
            </Box>
        </Tooltip>
    )
});

export default EnergyNumber;

EnergyNumber.propTypes = {
    value: PropTypes.number,
};