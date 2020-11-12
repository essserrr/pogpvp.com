import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
import WeatherBoosted from "./WeatherBoosted";
import CP from "App/Components/CpAndTypes/CP";

import { tierHP } from "js/bases/tierHP";
import { weather } from "js/bases/weather";

import { willow } from "locale/Pve/Willow/Willow";
import { settings } from "locale/Pve/Settings/Settings";
import { getCookie } from "js/getCookie";

const useStyles = makeStyles((theme) => ({
    bubble: {
        position: "absolute",
        bottom: "25px",

        maxWidth: "650px",

        textAlign: "justify",
    },
}));

let pvestrings = new LocalizedStrings(willow);
let settingStrings = new LocalizedStrings(settings);

const PveWillow = React.memo(function PveWillow(props) {
    pvestrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    settingStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const isBoosted = () => {
        const bossType = props.pokemonTable[props.snapshot.bossObj.Name].Type;
        const currWeather = props.snapshot.pveObj.Weather;
        let isBoosted = false;

        bossType.forEach((type) => {
            if (weather[currWeather][type]) { isBoosted = true }
        })

        return isBoosted
    }
    const boosted = isBoosted();


    return (
        <Grid container justify="center" alignItems="center">


            <Box position="relative">

                <Iconer fileName="willow3" folderName="/" />

                <Paper className={classes.bubble} elevation={4}>
                    <Box px={1} py={1}>
                        <Typography variant="body2">


                            {`${pvestrings.willow1} `}<b>{props.snapshot.bossObj.Name}</b>{". "}

                            {`${pvestrings.willow2}: `}<b>{tierHP[props.snapshot.bossObj.Tier]}</b>{", "}

                            {`${pvestrings.willow3}: `}<b>{`${props.snapshot.bossObj.Tier > 3 ? 300 : 180}${pvestrings.s}`}</b>{". "}

                            {`${pvestrings.willow4}: `}
                            <b>
                                {`${settingStrings.weatherList[props.snapshot.pveObj.Weather]} `}
                                {(props.snapshot.pveObj.Weather > 0) &&
                                    <Iconer folderName="/weather/" fileName={props.snapshot.pveObj.Weather} size={18} />}
                            </b>

                            {props.snapshot.pveObj.Weather > 0 ?
                                `. ${pvestrings.willow6}:` : null}

                            {props.snapshot.pveObj.Weather > 0 && <WeatherBoosted weather={props.snapshot.pveObj.Weather} />}

                            {`. ${pvestrings.willow5}: `}<b>{boosted ? `${pvestrings.boosted} ` : `${pvestrings.normal} `}</b>

                            <b>
                                <CP name={props.snapshot.bossObj.Name} Lvl={boosted ? 25 : 20} Atk={10} Def={10} Sta={10} pokemonTable={props.pokemonTable} />
                                {" - "}
                                <CP name={props.snapshot.bossObj.Name} Lvl={boosted ? 25 : 20} Atk={15} Def={15} Sta={15} pokemonTable={props.pokemonTable} />
                            </b>{"."}

                        </Typography>
                    </Box>
                </Paper>

            </Box>

        </Grid>
    )
});


export default PveWillow;

PveWillow.propTypes = {
    pokemonTable: PropTypes.object,
    snapshot: PropTypes.object,
};