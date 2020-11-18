import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SearchableSelect from "App/Components/SearchableSelect/SearchableSelect"

import { pveLocale } from "locale/Pve/CustomPve/CustomPve";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(pveLocale);

const PlayerParty = React.memo(function PlayerParty(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    return (
        <Grid container alignItems="center" justify="center">
            <Grid item xs={12}>
                <Typography variant="body1">
                    {`${strings.party} ${props.partyNumber + 1}`}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <SearchableSelect
                    label={strings.selectGroup}

                    name="partySelect"
                    attr={String(props.playerNumber)}
                    category={String(props.partyNumber)}

                    disableClearable
                    value={props.value}
                    onChange={props.onChange}
                >
                    {props.list}
                </SearchableSelect>
            </Grid>
        </Grid>
    )
});


export default PlayerParty;

PlayerParty.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.string,
    partyNumber: PropTypes.number,
    playerNumber: PropTypes.number,
    onChange: PropTypes.func,
};