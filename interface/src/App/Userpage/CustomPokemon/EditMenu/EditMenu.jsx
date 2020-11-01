import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import SubmitButton from "App/PvP/components/SubmitButton/SubmitButton";
import PokemonPanel from "App/PvE/Components/Panels/PokemonPanel/PokemonPanel";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/CustomPokemons/CustomPokemons";

let strings = new LocalizedStrings(userLocale);

const EditMenu = React.memo(function EditMenu(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <Grid container justify="center">
            <Grid item xs={12}>
                <PokemonPanel
                    colSize={12}
                    attr={props.attr}
                    canBeShadow={true}
                    hasSecondCharge={true}

                    pokemonTable={props.pokemonTable}
                    moveTable={props.moveTable}
                    notOk={props.notOk}

                    pokList={props.pokList}
                    chargeMoveList={props.chargeMoveList}
                    quickMoveList={props.quickMoveList}

                    value={props.editPokemon}

                    onChange={props.onChange}
                    onClick={props.onMenuClose}
                />
            </Grid>
            <Box mt={3}>
                <SubmitButton
                    class="submit-button--lg btn btn-primary btn-sm mx-1 my-2"
                    attr={props.attr}
                    onSubmit={props.onPokemonEditSubmit}
                >
                    {strings.userpok.changes}
                </SubmitButton>
            </Box>
        </Grid>
    )
});


export default EditMenu;

EditMenu.propTypes = {
    onMenuClose: PropTypes.func,
    onChange: PropTypes.func,
    onPokemonEditSubmit: PropTypes.func,

    attr: PropTypes.string,
    value: PropTypes.object,
    notOk: PropTypes.object,

    chargeMoveList: PropTypes.arrayOf(PropTypes.object),
    quickMoveList: PropTypes.arrayOf(PropTypes.object),

    pokemonTable: PropTypes.object,
    moveTable: PropTypes.object,
};