import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import PokemonCard from "App/Components/PokemonCard/PokemonCard";
import Iconer from "App/Components/Iconer/Iconer";
import EvoTiers from "./EvoTiers/EvoTiers";
import CardBody from "App/EggsList/RenderEggList/EggsTier/CardBody";

import { locale } from "locale/Evolve/Evolve";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale)

const EvoList = React.memo(function EvoList(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const { stats } = props;

    //creates list of all evolutions of selected pok
    const evolist = (pokEntry, pokTable, list, stage) => {
        list.push({ name: pokEntry.Title, stage: stage })
        for (let i = 0; i < pokEntry.Evolutions.length; i++) {
            evolist(pokTable[pokEntry.Evolutions[i]], pokTable, list, stage + 1)
        }
    }

    let evolits = [];
    evolist(props.pokemonTable[stats.name], props.pokemonTable, evolits, 0);

    return (
        <EvoTiers>

            {evolits.reduce((result, elem) => {
                if (!result[elem.stage]) { result.push([]) };
                const pokemon = props.pokemonTable[elem.name];
                const fileName = `${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`;
                const to = navigator.userAgent === "ReactSnap" ? "/" : "/pokedex/id/" + encodeURIComponent(elem.name);

                result[elem.stage].push(
                    <Grid key={elem.name + "wrap"} item xs={5} sm={4}>
                        <PokemonCard
                            title={<Typography variant="body1" align="center">{elem.name}</Typography>}

                            icon={
                                <Box mx={1}>
                                    <Link title={`${strings.dexentr} ${elem.name}`} to={to}>
                                        <Iconer folderName="/pokemons/" fileName={fileName} size={48} />
                                    </Link>
                                </Box>}

                            body={<CardBody name={elem.name} forEvo stats={stats} pokTable={props.pokemonTable} />}
                        />
                    </Grid >
                )
                return result;
            }, [])}

        </EvoTiers>
    )
});

export default EvoList;

EvoList.propTypes = {
    stats: PropTypes.object.isRequired,
    pokemonTable: PropTypes.object.isRequired,
};