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

const ZeroList = React.memo(function ZeroList(props) {
    advisorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    optionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");


    const zerosList = props.children.map((elem, i) => {
        const pok = props.rightPanel.listForBattle[elem]
        return (
            <TableIcon pok={pok}
                pokemonTable={props.pokemonTable} moveTable={props.moveTable} />
        )
    })

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography align="center" variant="h6">
                    {advisorStrings.advisor.bad}
                </Typography>
            </Grid>

            <Grid item xs={12} container spacing={1} justify="center">
                {zerosList.length > 0 ?
                    zerosList
                    :
                    <Typography align="center" variant="body1">
                        {optionStrings.options.moveSelect.none}
                    </Typography>}
            </Grid>
        </Grid>
    )
});

export default ZeroList;

ZeroList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    rightPanel: PropTypes.object,
    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};