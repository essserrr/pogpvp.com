import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import SubmitButton from "App/PvP/components/SubmitButton/SubmitButton"

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";

let strings = new LocalizedStrings(userLocale)

const SubmitRow = React.memo(function SubmitRow(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid item xs={12} container justify="center" alignItems="center">
            <SubmitButton
                class="submit-button--lg btn btn-primary btn-sm"
                attr={props.attr}
                onSubmit={props.onPokemonAdd}
            >
                {strings.userpok.addpok}
            </SubmitButton>
            <Box fontWeight={500} fontSize={"12pt"} mx={2} >{strings.userpok.or}</Box>
            <SubmitButton
                class="submit-button--lg btn btn-primary btn-sm"
                attr={props.attr}
                onSubmit={props.onTurnOnImport}
            >
                {strings.impExp}
            </SubmitButton>
        </Grid>
    )
});

export default SubmitRow;

SubmitRow.propTypes = {
    onTurnOnImport: PropTypes.func,
    onPokemonAdd: PropTypes.func,

    attr: PropTypes.string,
};
