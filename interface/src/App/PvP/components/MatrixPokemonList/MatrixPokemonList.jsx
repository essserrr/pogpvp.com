import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import MatrixListEntry from "../MatrixPokemonList/MatrixListEntry/MatrixListEntry"
import Iconer from "App/Components/Iconer/Iconer";

const useStyles = makeStyles((theme) => ({
    pokList: {
        overflowX: "hidden",
        overflowY: "auto",

        maxHeight: "150px",
    },
}));

const MatrixPokemonList = React.memo(function MatrixPokemonList(props) {
    const classes = useStyles();

    const addStar = (pokName, moveName) => {
        return (props.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    return (
        <Box clone p={0.5}>
            <Grid container justify="center" className={classes.pokList}>
                {props.children.map((elem, i) => {
                    const fileName = props.pokemonTable[elem.name].Number + (props.pokemonTable[elem.name].Forme !== "" ? "-" + props.pokemonTable[elem.name].Forme : "")
                    return (
                        <MatrixListEntry
                            attr={props.attr}
                            key={i}
                            index={i}

                            onPokemonDelete={props.onPokemonDelete}
                            onClick={props.onPokRedact}

                            thead={
                                <>
                                    <Iconer folderName="/pokemons/" fileName={fileName} size={24} />
                                    {elem.name}
                                </>}
                            body={
                                <>
                                    {elem.QuickMove + addStar(elem.name, elem.QuickMove)}<br />
                                    {(elem.ChargeMove1 ? elem.ChargeMove1 + addStar(elem.name, elem.ChargeMove1) : "") +
                                        (elem.ChargeMove2 ? " / " + elem.ChargeMove2 + addStar(elem.name, elem.ChargeMove2) : "")}
                                </>

                            }
                        />
                    )
                })}
            </Grid>
        </Box>
    )
});

export default MatrixPokemonList;

MatrixPokemonList.propTypes = {
    attr: PropTypes.string,
    pokemonTable: PropTypes.object,

    onPokRedact: PropTypes.func,
    onPokemonDelete: PropTypes.func,

    children: PropTypes.arrayOf(PropTypes.object)
};