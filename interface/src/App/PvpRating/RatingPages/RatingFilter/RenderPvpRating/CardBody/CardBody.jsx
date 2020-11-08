import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";

import { getCookie } from "js/getCookie";
import { locale } from "locale/Rating/Rating";

const useStyles = makeStyles((theme) => ({
    secondIcon: {
        marginLeft: `${theme.spacing(1)}px`,
    },
    body: {
        paddingRight: `${theme.spacing(2)}px`,
    },
    score: {
        backgroundColor: theme.palette.background.main,
        borderRadius: "5px",
        border: "0.5px solid rgba(0, 0, 0, 0.295)",
        height: "fit-content",

        fontSize: "1.2rem",
        fontWeight: "bold",
        textAlign: "center",
    },
}));

let strings = new LocalizedStrings(locale)

const CardBody = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const pokemon = props.pokemonTable[props.name]
    return (
        <Grid container justify="center" alignItems="center" spacing={1} className={classes.body}>

            <Grid item xs>
                <Grid container justify="flex-start" alignItems="center">
                    <Box component="span" mr={1} >
                        {strings.rating.type}
                    </Box>
                    {(pokemon.Type[0] !== undefined) &&
                        <Iconer size={18}
                            folderName="/type/" fileName={String(pokemon.Type[0])}
                        />}
                    {(pokemon.Type[1] !== undefined) &&
                        <Iconer className={classes.secondIcon} size={18}
                            folderName="/type/" fileName={String(pokemon.Type[1])}
                        />}

                    <Grid item xs={12}>{`${strings.rating.avgRate} ${props.entry.AvgRate}`}</Grid>
                    <Grid item xs={12}>{`${strings.rating.avgWin} ${(props.entry.AvgWinrate * 100).toFixed(0)}%`}</Grid>
                </Grid>
            </Grid>

            <Grid item xs="auto" className={classes.score}>
                {strings.rating.score}<br />
                {(props.entry.AvgRateWeighted / props.maxWeighted * 100).toFixed(1)}
            </Grid>

        </Grid>
    )
});

export default CardBody;

CardBody.propTypes = {
    name: PropTypes.string.isRequired,
    pokemonTable: PropTypes.object.isRequired,

    maxWeighted: PropTypes.number.isRequired,
    entry: PropTypes.object.isRequired,
};