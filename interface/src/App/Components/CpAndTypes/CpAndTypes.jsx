import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
import { ReactComponent as Shadow } from "icons/shadow.svg";
import CP from "App/Components/CpAndTypes/CP";

const useStyles = makeStyles((theme) => ({
    shadowIcon: {
        position: "absolute",
        top: "-3px",
        right: "-6px",

        width: "16px",
        height: "16px",
    },
}));

const CpAndTyping = React.memo(function CpAndTyping(props) {
    const { Lvl, Atk, Def, Sta, pokemonTable, name, tier, isBoss, isShadow, ...other } = props;
    const classes = useStyles();

    const pokemon = pokemonTable[name];

    return (
        <Grid container alignItems="center" justify="center" {...other}>
            <Box mr={1} position="relative">
                <Iconer
                    folderName="/pokemons/"
                    fileName={`${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`}
                    size={36}
                />
                {isShadow && <Shadow className={classes.shadowIcon} />}
            </Box>
            <Box mr={1}>
                <CP
                    name={name}
                    tier={tier}
                    isBoss={isBoss}

                    Lvl={Lvl}
                    Atk={Atk}
                    Def={Def}
                    Sta={Sta}
                    pokemonTable={pokemonTable}
                />
            </Box>
            {(pokemon.Type[0] !== undefined) &&
                <Box>
                    <Iconer
                        folderName="/type/"
                        fileName={`${pokemon.Type[0]}`}
                        size={18}
                    />
                </Box>}
            {(pokemon.Type[1] !== undefined) &&
                <Box ml={1}>
                    <Iconer
                        folderName="/type/"
                        fileName={`${pokemon.Type[1]}`}
                        size={18}
                    />
                </Box>}
        </Grid>

    )

});

export default CpAndTyping;

CpAndTyping.propTypes = {
    Lvl: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    Atk: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    Def: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    Sta: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),

    pokemonTable: PropTypes.object,

    name: PropTypes.string,
    tier: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),

    isBoss: PropTypes.bool,
    isShadow: PropTypes.bool,
};