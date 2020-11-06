import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { makeStyles } from '@material-ui/core/styles';

import PokemonCard from "App/Components/PokemonCard/PokemonCard";
import Iconer from "App/Components/Iconer/Iconer";
import CardBody from "./CardBody";

import { regionals } from "./regionals";
import { getCookie } from "js/getCookie";
import { capitalizeFirst } from "js/indexFunctions";
import { regionLocale } from "locale/Eggs/regionLocale";
import { locale } from "locale/Eggs/Eggs";

let strings = new LocalizedStrings(locale);
let regionStrings = new LocalizedStrings(regionLocale);

const useStyles = makeStyles((theme) => ({
    separator: {
        fontSize: "1.7rem",
        fontWeight: "600",
        color: "white",
        "-webkit-text-stroke": "1px black",

        display: "flex",
        alignItems: "center",
        textAlign: "center",

        "&::before": {
            marginRight: "0.25em",
            content: '""',
            flex: "1",
            borderBottom: `1px solid ${theme.palette.text.disabled}`,
        },
        "&::after": {
            marginLeft: "0.25em",
            content: '""',
            flex: "1",
            borderBottom: `1px solid ${theme.palette.text.disabled}`,
        },
    },
}));

const EggsTier = React.memo(function EggsTier(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    regionStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
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

    const makeCards = () => {
        return props.list.reduce((result, elem) => {
            //gtry to get name
            const name = getName(elem)
            //skip errors and reginals if regionals are not selected
            if (!name || (!props.showReg && regionals[name])) {
                return result
            }
            const pokemon = props.pokTable[name]
            result.push(
                <Grid key={name + "wrap"} item xs={6} sm={4} lg={3}>
                    <PokemonCard
                        title={
                            <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" padding={0.25}>
                                <Typography align="center" variant="body2">{name}</Typography>
                                {regionals[name] &&
                                    <Box ml={1}>
                                        <Tooltip placement="top" arrow title={<Typography color="inherit">{regionStrings[regionals[name]]}</Typography>}>
                                            <HelpOutlineIcon fontSize="small" />
                                        </Tooltip>
                                    </Box>}
                            </Box>}

                        icon={
                            <Link title={strings.dexentr + name} to={"/pokedex/id/" + encodeURIComponent(name)}>
                                <Box p={0.5}>
                                    <Iconer
                                        folderName="/pokemons/"
                                        fileName={`${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`}
                                        size={48}
                                    />
                                </Box>
                            </Link>}

                        body={<CardBody name={name} pokTable={props.pokTable} />}
                    />
                </Grid>)
            return result;
        }, [])
    }

    return (
        <Grid container justify="center" spacing={2}>
            {props.title &&
                <Grid item xs={12} className={classes.separator}>
                    {props.title}
                </Grid>}

            <Grid item xs={12}>
                <Grid container justify="center" spacing={1}>
                    {makeCards()}
                </Grid>
            </Grid>
        </Grid>
    )
});


export default EggsTier;

EggsTier.propTypes = {
    showReg: PropTypes.bool,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
    ]),
    pokTable: PropTypes.object.isRequired,
};