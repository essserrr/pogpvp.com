import React from "react";

import Grid from '@material-ui/core/Grid';

import PvePokemon from "../../PvePokemon";

const PokemonPanel = React.memo(function PokemonPanel(props) {
    const { title, ...other } = props;

    return (
        <Grid container justify="center" alignItems="center" >
            {title &&
                <Grid item xs={12}>
                    <h5 className="fBolder m-0 p-0">{title}</h5>
                </Grid>}
            <Grid item xs={12}>
                <PvePokemon
                    {...other}
                />
            </Grid>
        </Grid>
    )
});

export default PokemonPanel