import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import WeatherMoves from "../WeatherMoves/WeatherMoves";
import { calculateEffStat } from "js/indexFunctions";
import { calculateCP } from "js/cp/calculateCP";

const NameAndMoves = React.memo(function NameAndMoves(props) {
    return (
        <Grid container>
            <Grid item xs={12} container alignItems="center">
                <Box fontWeight="bold" px={0.5}>
                    {props.formattedName.Name}
                </Box>
                <WeatherMoves
                    pokQick={props.quick}
                    pokCh={props.charge}
                    weather={props.snapshot.pveObj.Weather}
                />
            </Grid>
            <Grid item xs={12}>
                {"CP "}
                {calculateCP(props.name, props.snapshot[props.attr].Lvl, props.snapshot[props.attr].Atk, props.snapshot[props.attr].Def, props.snapshot[props.attr].Sta, props.pokemonTable)}
                {" / HP "}
                {calculateEffStat(props.name, props.snapshot[props.attr].Lvl, props.snapshot[props.attr].Sta, 0, props.pokemonTable, "Sta", false)}
                {props.formattedName.Additional && (" / " + props.formattedName.Additional)}
            </Grid>
        </Grid>
    )
});

export default NameAndMoves;

NameAndMoves.propTypes = {
    formattedName: PropTypes.object,
    quick: PropTypes.object,
    charge: PropTypes.object,
    snapshot: PropTypes.object,

    attr: PropTypes.string,
    name: PropTypes.string,
    pokemonTable: PropTypes.object,
};