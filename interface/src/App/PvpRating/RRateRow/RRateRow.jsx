import React from "react";

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer"
import { ReactComponent as Shadow } from "../../../icons/shadow.svg"
import { Link } from "react-router-dom"


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

        position: "relative",
        "-webkit-transition": 'all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)',
        transition: "all 0.15s cubic-bezier(0.165, 0.84, 0.44, 1)",


        "&::after": {
            content: '""',
            borderRadius: `${theme.spacing(0.5)}px`,
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
            opacity: 0,
            "-webkit-transition": "all 0.15s linear",
            transition: "all 0.15s linear",
        },

        "&:hover": {
            "-webkit-transform": "scale(1.05, 1.05)",
            transform: "scale(1.05, 1.05)",
        },
        "&:hover::after": {
            opacity: 1,
            display: "block",
        },
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
    const pokemon = props.pokemonTable[props.pokName];


    return (
        <Link style={{ color: "black" }} key={props.value.Name} name={props.pokName} to={props.onClickRedirect(props.value.Name)}
            className={classes.rPok}>

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