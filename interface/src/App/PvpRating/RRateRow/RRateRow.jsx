import React from "react";
import { Link } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import useAnimation from "css/hoverAnimation";
import Iconer from "App/Components/Iconer/Iconer";
import { ReactComponent as Shadow } from "icons/shadow.svg";

const useStyles = makeStyles((theme) => ({
    rPok: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",

        padding: `${theme.spacing(0.5)}px ${theme.spacing(0.75)}px`,
        backgroundColor: theme.palette.background.main,
        borderRadius: `${theme.spacing(0.5)}px`,
        border: "0.5px solid rgba(0, 0, 0, 0.295)",
        height: "fit-content",
        fontWeight: 400,
    },
    marginLeft: {
        marginLeft: `${theme.spacing(0.5)}px`,
    },
    marginRight: {
        marginRight: `${theme.spacing(0.5)}px`,
    }
}));

const RRateRow = React.memo(function (props) {
    const classes = useStyles();
    const animation = useAnimation();
    const pokemon = props.pokemonTable[props.pokName];

    return (
        <Link style={{ color: "black" }} key={props.value.Name} name={props.pokName} to={props.onClickRedirect(props.value.Name)}
            className={`${classes.rPok} ${animation.animation}`}>

            <Grid item container xs alignItems="center" >
                <Iconer folderName="/pokemons/" fileName={`${pokemon.Number}${pokemon.Forme !== "" ? `-${pokemon.Forme}` : ""}`}
                    size={24} className={classes.marginRight}
                />
                {props.pokName}
                {(props.pokName !== props.value.Name) && <Shadow style={{ width: "24px", height: "24px" }} className={classes.marginLeft} />}
            </Grid>

            <Grid item xs="auto">
                {props.value.Rate}
            </Grid>

        </Link>
    )
});

export default RRateRow;