import React from "react";
import PropTypes from 'prop-types';
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TableIcon from "App/PvP/components/TableBodyRender/TableIcon/TableIcon";

import { advisor } from "locale/Pvp/Advisor/Advisor";
import { options } from "locale/Components/Options/locale";
import { getCookie } from "js/getCookie";

let advisorStrings = new LocalizedStrings(advisor);
let optionStrings = new LocalizedStrings(options);

const MoveTypingTable = React.memo(function MoveTypingTable(props) {
    advisorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    return (
        <Grid container spacing={1}>

            <Grid item xs={12}>
                <Typography align="cente" variant="h6">
                    {advisorStrings.advisor.def}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                {advisorStrings.advisor.res} {vun[1].length > 0 ? vun[1] : optionStrings.options.moveSelect.none}
            </Grid>
            <Grid item xs={12}>
                {advisorStrings.advisor.weak}  {vun[2].length > 0 ? vun[2] : optionStrings.options.moveSelect.none}
            </Grid>

        </Grid>
    )
});

export default MoveTypingTable;

MoveTypingTable.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    rightPanel: PropTypes.object,
    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};