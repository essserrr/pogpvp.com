import React from "react";

import Grid from '@material-ui/core/Grid';


import Iconer from "App/Components/Iconer/Iconer"



import CP from "./CP"
import Type from "./Type"
import PokemonIconer from "../PokemonIconer/PokemonIconer"

const CpAndTyping = React.memo(function (props) {
    const { Lvl, Atk, Def, Sta, pokemonTable, name, tier, isBoss, ...other } = props;


    const pokemon = pokemonTable[name]

    return (
        <Grid container spacing={1} alignItems="center" justify="center" {...other}>
            <Grid item xs="auto">
                <Iconer
                    folderName="/pokemons/"
                    fileName={`${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`}
                    size={36}
                />
            </Grid>
            <Grid item xs="auto">
                <CP
                    name={name}
                    tier={tier}
                    isBoss={isBoss}

                    Lvl={Lvl}
                    Atk={Atk}
                    Def={Def}
                    Sta={Sta}
                    pokemonTable={pokemonTable}
                />
            </Grid>

            {(pokemon.Type[0] !== undefined) &&
                <Grid item xs="auto">
                    <Iconer
                        folderName="/type/"
                        fileName={`${pokemon.Type[0]}`}
                        size={18}
                    />
                </Grid>}

            {(pokemon.Type[1] !== undefined) &&
                <Grid item xs="auto">
                    <Iconer
                        folderName="/type/"
                        fileName={`${pokemon.Type[1]}`}
                        size={18}
                    />
                </Grid>}
        </Grid>

    )

});

export default CpAndTyping;