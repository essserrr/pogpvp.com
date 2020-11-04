import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SaveIcon from '@material-ui/icons/Save';

import Button from "App/Components/Button/Button";
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
                <Button
                    attr={props.attr}
                    disabled={Object.values(props.notOk).reduce((sum, val) => sum || (val !== ""), false)}
                    onClick={props.onPokemonEditSubmit}
                    title={strings.userpok.changes}
                    endIcon={<SaveIcon />}
                />
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