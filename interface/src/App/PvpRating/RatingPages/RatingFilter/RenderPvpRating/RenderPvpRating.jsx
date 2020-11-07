import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import PokemonCard from "App/Components/PokemonCard/PokemonCard";
import Iconer from "App/Components/Iconer/Iconer";
import Collapsable from "./Collapsable/Collapsable";
import CardBody from "./CardBody/CardBody";

import { ReactComponent as Shadow } from "icons/shadow.svg";
import { checkShadow } from "js/indexFunctions";
import { getCookie } from "js/getCookie";
import { locale } from "locale/Rating/Rating";
import { options } from "locale/Components/Options/locale";

let strings = new LocalizedStrings(locale);
let optionsStrings = new LocalizedStrings(options);

const useStyles = makeStyles((theme) => ({
    iconContainer: {
        display: "block",
        position: "relative",
        height: "100%",
        lineHeight: "inherit",
    },
    shadowIcon: {
        position: "absolute",
        right: "-15px",
        top: "-7px",
    },
}));

const RenderPvpRating = React.memo(function RenderPvpRating(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    optionsStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        props.children.reduce((result, elem, i) => {
            const pokName = checkShadow(elem.Name, props.pokemonTable);
            if (!pokName) { return result }
            const pokemon = props.pokemonTable[pokName];

            result.push(
                <PokemonCard
                    key={elem.Name}
                    gridProps={{ spacing: 1 }}

                    title={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" align="center">
                                {"#" + (elem.rank)}
                            </Typography>
                            <Typography variant="h6" align="center">
                                {pokName + ((pokName !== elem.Name) ? " (" + optionsStrings.options.type.shadow + ")" : "")}
                            </Typography>
                            <Box />
                        </Box>}

                    icon={
                        <Link className={classes.iconContainer}
                            title={strings.dexentr + pokName} to={(navigator.userAgent === "ReactSnap") ? "/" : `/pokedex/id/${encodeURIComponent(pokName)}`}>

                            {(pokName !== elem.Name) && <Shadow style={{ width: 24, height: 24 }} className={classes.shadowIcon} />}

                            <Iconer folderName="/pokemons/" fileName={`${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`}
                                size={64} />

                        </Link>}

                    body={<CardBody name={pokName} entry={elem}
                        pokemonTable={props.pokemonTable} maxWeighted={props.children[0].AvgRateWeighted}
                    />}

                    footer={<Collapsable
                        pokemonTable={props.pokemonTable}
                        moveTable={props.moveTable}
                        ratingList={props.originalList}

                        container={elem}
                        league={props.league}
                        combination={props.combination}
                    />}
                />)

            return result;
        }, [])
    )
});


export default RenderPvpRating;

Collapsable.propTypes = {
    children: PropTypes.array,

    originalList: PropTypes.array,

    container: PropTypes.object.isRequired,
    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,
};