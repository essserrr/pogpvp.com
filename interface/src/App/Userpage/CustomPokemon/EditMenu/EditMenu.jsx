import React from "react"
import LocalizedStrings from "react-localization"

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import SubmitButton from "../../../PvP/components/SubmitButton/SubmitButton"
import PokemonPanel from "../../../PvE/Components/Panels/PokemonPanel/PokemonPanel"

import { getCookie } from "../../../../js/getCookie"
import { userLocale } from "../../../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);


class EditMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }

    render() {
        return (
            <Grid container justify="center">
                <Grid item xs={12}>
                    <PokemonPanel
                        colSize={12}
                        attr={this.props.attr}
                        canBeShadow={true}
                        hasSecondCharge={true}

                        pokemonTable={this.props.pokemonTable}
                        moveTable={this.props.moveTable}


                        pokList={this.props.pokList}
                        chargeMoveList={this.props.chargeMoveList}
                        quickMoveList={this.props.quickMoveList}

                        value={this.props.editPokemon}

                        onChange={this.props.onChange}
                        onClick={this.props.onMenuClose}
                    />
                </Grid>
                <Box mt={3}>
                    <SubmitButton
                        class="submit-button--lg btn btn-primary btn-sm mx-1 my-2"
                        attr={this.props.attr}
                        onSubmit={this.props.onPokemonEditSubmit}
                    >
                        {strings.moveconstr.changes}
                    </SubmitButton>
                </Box>
            </Grid>
        );
    }
}


export default EditMenu