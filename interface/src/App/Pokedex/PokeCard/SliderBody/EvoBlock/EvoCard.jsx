import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const useStyles = makeStyles((theme) => ({
    icon: {
        flex: "1",
        maxWidth: "128px",
        maxHeight: "128px",
        objectFit: "contain",
    },
}));

const EvoCard = React.memo(function EvoCard(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const pokemon = props.pokTable[props.name];
    const title = `${strings.dexentr} ${props.name}`;
    const to = (navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + (encodeURIComponent(props.name));
    const fileName = `${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`;

    return (
        <Grid item xs={6} lg={4}>
            <Grid container justify="center" spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="body1" align="center">
                        {`#${pokemon.Number} ${props.name}`}
                    </Typography>
                </Grid>

                <Grid item xs={12} container justify="center">
                    <Iconer size={18} folderName="/type/" fileName={String(pokemon.Type[0])} />
                    {pokemon.Type.length > 1 &&
                        <Box ml={1}>
                            <Iconer size={18} folderName="/type/" fileName={String(pokemon.Type[1])} />
                        </Box>}
                </Grid>

                <Grid item xs={12} container justify="center">
                    <Link title={title} to={to}>
                        <Iconer fileName={fileName} folderName="/art/" className={classes.icon} />
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    )

});

export default EvoCard;

EvoCard.propTypes = {
    name: PropTypes.string.isRequired,
    pokTable: PropTypes.object.isRequired,
};