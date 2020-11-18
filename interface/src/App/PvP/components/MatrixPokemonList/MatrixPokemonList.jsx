import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import ColoredMove from "App/Components/ColoredMove/ColoredMove";
import MatrixListEntry from "../MatrixPokemonList/MatrixListEntry/MatrixListEntry";
import Iconer from "App/Components/Iconer/Iconer";

import { addStar } from "js/addStar";

const useStyles = makeStyles((theme) => ({
    pokList: {
        overflowX: "hidden",
        overflowY: "auto",

        maxHeight: "150px",
    },
}));

const MatrixPokemonList = React.memo(function MatrixPokemonList(props) {
    const classes = useStyles();

    return (
        <Box clone p={0.5}>
            <Grid container justify="center" className={classes.pokList} spacing={1}>
                {props.children.map((elem, i) => {
                    const fileName = props.pokemonTable[elem.name].Number + (props.pokemonTable[elem.name].Forme !== "" ? "-" + props.pokemonTable[elem.name].Forme : "")
                    return (
                        <Grid item xs={12} key={i}>
                            <MatrixListEntry
                                attr={props.attr}
                                index={i}

                                onPokemonDelete={props.onPokemonDelete}
                                onClick={props.onPokRedact}

                                icon={<Iconer folderName="/pokemons/" fileName={fileName} size={24} />}
                                isShadow={String(elem.IsShadow) === "true"}
                                name={elem.name}

                                body={
                                    <>
                                        <ColoredMove type={props.moveTable[elem.QuickMove].MoveType}>
                                            {elem.QuickMove + addStar(elem.name, elem.QuickMove, props.pokemonTable)}
                                        </ColoredMove>

                                        {elem.ChargeMove1 &&
                                            <ColoredMove type={props.moveTable[elem.ChargeMove1].MoveType}>
                                                {elem.ChargeMove1 + addStar(elem.name, elem.ChargeMove1, props.pokemonTable)}
                                            </ColoredMove>}

                                        {elem.ChargeMove2 &&
                                            <ColoredMove type={props.moveTable[elem.ChargeMove2].MoveType}>
                                                {elem.ChargeMove2 + addStar(elem.name, elem.ChargeMove2, props.pokemonTable)}
                                            </ColoredMove>}
                                    </>
                                }
                            />
                        </Grid>
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
    moveTable: PropTypes.object,

    onPokRedact: PropTypes.func,
    onPokemonDelete: PropTypes.func,

    children: PropTypes.arrayOf(PropTypes.object)
};