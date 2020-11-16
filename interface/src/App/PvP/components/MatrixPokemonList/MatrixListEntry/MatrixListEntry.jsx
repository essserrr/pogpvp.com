import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import CloseButton from "App/Components/CloseButton/CloseButton";
import GreyPaper from "App/Components/GreyPaper/GreyPaper";

const useStyles = makeStyles((theme) => ({
    pokemonName: {
        textAlign: "center",
        fontWeight: "bold",
    },
    movestContainer: {
        fontWeight: "bold",
        textAlign: "center",
        "& div": {
            marginTop: `${theme.spacing(0.5)}px`
        }
    },
}));

const MatrixListEntry = React.memo(function MatrixListEntry(props) {
    const classes = useStyles();

    return (
        <GreyPaper elevation={2} enablePadding paddingMult={0.25} style={{ backgroundColor: "white", cursor: "pointer" }}
            onClick={(event, ...other) => props.onClick(event, { attr: props.attr, name: props.index }, ...other)} >
            <Grid container>

                <Grid item xs={12} container wrap="nowrap" alignItems="center" justify="space-between">

                    {props.icon}

                    <Box clone pl={0.5}>
                        <Grid item xs className={classes.pokemonName}>
                            {props.name}
                        </Grid>
                    </Box>

                    <Box alignSelf="flex-start">
                        <CloseButton
                            onClick={
                                (event, ...other) => { event.stopPropagation(); props.onPokemonDelete(event, { attr: props.attr, name: props.index }, ...other) }}
                            attr={props.attr}
                            index={props.index}
                        />
                    </Box>

                </Grid>
                <Grid item xs={12} className={classes.movestContainer}>
                    {props.body}
                </Grid>
            </Grid>
        </GreyPaper>
    )
});

export default MatrixListEntry;

MatrixListEntry.propTypes = {
    attr: PropTypes.string,
    index: PropTypes.number,

    onPokemonDelete: PropTypes.func,
    onClick: PropTypes.func,

    icon: PropTypes.node,
    name: PropTypes.string,

    body: PropTypes.node,
};