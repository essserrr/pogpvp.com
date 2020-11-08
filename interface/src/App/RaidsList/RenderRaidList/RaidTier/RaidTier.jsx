import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Tier from "App/Evolve/EvoList/EvoTiers/Tier/Tier";
import PokemonCard from "App/Components/PokemonCard/PokemonCard";
import Iconer from "App/Components/Iconer/Iconer";
import CardBody from "App/EggsList/RenderEggList/EggsTier/CardBody";
import { capitalizeFirst } from "js/indexFunctions";
import { getCookie } from "js/getCookie";
import { locale } from "locale/Raids/Raids";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: "210px",
    },
}));


let strings = new LocalizedStrings(locale)

const RaidTier = React.memo(function RaidTier(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const getName = (elem) => {
        let name = elem.replace("’", "")
        if (!props.pokTable[name]) {
            name = capitalizeFirst(name)
        }
        name = name.replace(/\.$/, "")
        if (!props.pokTable[name]) {
            console.log(`Critical: ""${name}" not found in the database`)
            return ""
        }
        return name
    }

    const bossName = props.i - 1;

    return (

        <Tier title={props.title}>
            {props.list.reduce((result, elem) => {
                const name = getName(elem);
                if (!name) return result;

                const pokemon = props.pokTable[name];
                const to = (navigator.userAgent === "ReactSnap") ? "/" : "/pve/common/" + strings.none + "___40_15_15_15_false/" +
                    encodeURIComponent(name) + "___" + bossName + "/0_0_0_18_3_true_false/___40_15_15_15_false";
                const fileName = `${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`

                result.push(
                    <Grid key={name + "wrap"} item xs={6} sm={4} lg={3} className={classes.card}>
                        <PokemonCard
                            title={
                                <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" padding={0.25}>
                                    <Typography align="center" variant="body2">{name}</Typography>
                                </Box>}

                            icon={
                                <Link title={`${strings.topcounters} ${name}`} to={to}>
                                    <Box p={0.5}>
                                        <Iconer folderName="/pokemons/" fileName={fileName} size={48} />
                                    </Box>
                                </Link>}

                            body={<CardBody forRaids name={name} pokTable={props.pokTable} />}
                        />
                    </Grid>)
                return result
            }, [])}
        </Tier>
    )
});

export default RaidTier;

RaidTier.propTypes = {
    list: PropTypes.array,
    i: PropTypes.number.isRequired,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    pokTable: PropTypes.object.isRequired,
};