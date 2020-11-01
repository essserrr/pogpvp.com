import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";
import CloseButton from "App/Components/CloseButton/CloseButton";

import { ReactComponent as Shiny } from "icons/shiny.svg"

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: `${theme.spacing(0.5)}px`,

        borderRadius: "3px",
        border: `1px solid ${theme.palette.text.primary}`,
        fontWeight: "bold",
    },
    uShCard: {
        padding: `${theme.spacing(0.5)}px`,
    },
    uShCardContainer: {
        position: "relative",
    },

    uShCardShiny: {
        width: "18px",
        height: "18px",

        position: "absolute",
        right: "-3px",
    },
}));

const UserShinyCard = React.memo(function (props) {
    const classes = useStyles();

    function onClickWrapper(event) {
        if (props.onClick) {
            event.stopPropagation()
            props.onClick({ attr: props.attr, index: props.index })
        }
    }

    const pokemon = props.pokemonTable[props.value.Name]
    return (
        <Paper elevation={4} className={classes.paper}>
            <Grid container alignItems="center" className={classes.uShCard}>
                {props.value.Amount && `${props.value.Amount}X`}
                <Tooltip title={<Typography color="inherit">{props.value.Name}</Typography>}>
                    <Grid xs="auto" className={classes.uShCardContainer}>
                        {pokemon &&
                            <Iconer
                                size={36}
                                fileName={`${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`}
                                folderName="/pokemons/"
                            />}
                        {props.value.Type === "Shiny" ? <Shiny className={classes.uShCardShiny} /> : null}
                    </Grid>
                </Tooltip>
                {props.onClick && <CloseButton onClick={onClickWrapper} />}
            </Grid>
        </Paper>
    )
});

export default UserShinyCard;

UserShinyCard.propTypes = {
    attr: PropTypes.string,
    index: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    onClick: PropTypes.func,

    pokemonTable: PropTypes.object,
    value: PropTypes.object,
};
