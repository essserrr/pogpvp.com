import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import CP from "App/Components/CpAndTypes/CP"
import Stats from "App/PvP/components/Stats/Stats"

import { getCookie } from "js/getCookie";
import { dexLocale } from "locale/Pokedex/Pokecard";

let strings = new LocalizedStrings(dexLocale);

const CpCalc = React.memo(function CpCalc(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");

    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <Typography align="center" variant="h6">
                    {strings.entparams}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Stats
                    Lvl={props.value.Lvl}
                    Atk={props.value.Atk}
                    Def={props.value.Def}
                    Sta={props.value.Sta}
                    attr={props.attr}
                    onChange={props.onChange}
                />
            </Grid>

            <Grid item xs={12}>

                <Typography align="center">
                    {"CP: "}
                    <Box component="span" fontWeight="bold">

                        <CP
                            name={props.name}
                            isBoss={false}

                            Lvl={props.value.Lvl}
                            Atk={props.value.Atk}
                            Def={props.value.Def}
                            Sta={props.value.Sta}
                            pokemonTable={props.pokTable}
                        />
                    </Box>
                </Typography>

            </Grid>
        </Grid>
    )
});

export default CpCalc;

CpCalc.propTypes = {
    value: PropTypes.object.isRequired,
    name: PropTypes.string,
    attr: PropTypes.string,
    pokTable: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};