import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
import CP from "App/Components/CpAndTypes/CP";

import { weatherDecoder } from "js/decoders/weatherDecoder";

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "center",
        padding: `${theme.spacing(0.5)}px`,
    },
    secondIcon: {
        marginLeft: `${theme.spacing(0.5)}px`,
    },
}));

const CardBody = React.memo(function CardBody(props) {
    const classes = useStyles();
    const { name, forRaids, forEvo, stats } = props;

    const pokemon = props.pokTable[name]
    return (
        <Grid container justify="center" alignItems="center" spacing={forRaids ? 0 : 1} className={classes.root}>
            <Grid item xs={12}>
                {(pokemon.Type[0] !== undefined) &&
                    <Iconer
                        size={18}
                        folderName="/type/"
                        fileName={String(pokemon.Type[0])}
                    />}
                {(pokemon.Type[1] !== undefined) &&
                    <Iconer
                        className={classes.secondIcon}
                        size={18}
                        folderName="/type/"
                        fileName={String(pokemon.Type[1])}
                    />}
            </Grid>
            {!forEvo && <Grid item xs={12}>
                {"CP: "}
                <CP name={name} Lvl={forRaids ? 20 : 15} Atk={10} Def={10} Sta={10} pokemonTable={props.pokTable} />
                {"-"}
                <CP name={name} Lvl={forRaids ? 20 : 15} Atk={15} Def={15} Sta={15} pokemonTable={props.pokTable} />
            </Grid>}

            {forEvo && <Grid item xs={12}>
                {"CP: "}
                <CP name={name} Lvl={stats.Lvl} Atk={stats.Atk} Def={stats.Def} Sta={stats.Sta} pokemonTable={props.pokTable} />
            </Grid>}

            {forRaids && <Grid item xs={12}>
                {(pokemon.Type[0] !== undefined) &&
                    <Iconer
                        folderName="/weather/"
                        fileName={String(weatherDecoder[pokemon.Type[0]])}
                        size={18}
                    />}
                {(pokemon.Type[1] !== undefined) && weatherDecoder[pokemon.Type[1]] !== weatherDecoder[pokemon.Type[0]] &&
                    <Iconer
                        folderName="/weather/"
                        fileName={String(weatherDecoder[pokemon.Type[1]])}
                        size={18}
                    />}
                {": "}
                <CP name={name} Lvl={25} Atk={10} Def={10} Sta={10} pokemonTable={props.pokTable} />
                {"-"}
                <CP name={name} Lvl={25} Atk={15} Def={15} Sta={15} pokemonTable={props.pokTable} />
            </Grid>}

        </Grid>
    )
});

export default CardBody;

CardBody.propTypes = {
    forRaids: PropTypes.bool,
    forEvo: PropTypes.bool,

    stats: PropTypes.object,

    name: PropTypes.string.isRequired,
    pokTable: PropTypes.object.isRequired,
};