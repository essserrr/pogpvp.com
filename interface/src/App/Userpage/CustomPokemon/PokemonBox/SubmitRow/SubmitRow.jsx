import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import AuthButton from "App/Registration/RegForm/AuthButton/AuthButton";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";

let strings = new LocalizedStrings(userLocale)

const SubmitRow = React.memo(function SubmitRow(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid item xs={12} container justify="center" alignItems="center">
            <AuthButton
                attr={props.attr}
                disabled={Object.values(props.notOk).reduce((sum, val) => sum || (val !== ""), false)}
                onClick={props.onPokemonAdd}
                title={strings.userpok.addpok}
                endIcon={<AddCircleIcon />}
            />
            <Box fontWeight={500} fontSize={"12pt"} mx={2} >{strings.userpok.or}</Box>
            <AuthButton
                attr={props.attr}
                onClick={props.onTurnOnImport}
                title={strings.impExp}
                endIcon={<ImportExportIcon />}
            />
        </Grid>
    )
});

export default SubmitRow;

SubmitRow.propTypes = {
    onTurnOnImport: PropTypes.func,
    onPokemonAdd: PropTypes.func,
    notOk: PropTypes.object,
    attr: PropTypes.string,
};
