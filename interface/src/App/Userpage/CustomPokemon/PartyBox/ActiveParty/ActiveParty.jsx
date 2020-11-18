import React from "react"
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import UserPokCard from "App/Userpage/CustomPokemon/PokemonBox/UserPokemonList/UserPokCard/UserPokCard";

const useStyles = makeStyles((theme) => ({
    activeParty: {
        minHeight: "62px",
        maxHeight: "250px",

        paddingTop: `${theme.spacing(1)}px`,
        paddingBottom: `${theme.spacing(1)}px`,

        border: `1px solid ${theme.palette.text.primary}`,
        borderRadius: "5px",

        overflowY: "auto",
    },

    activePartyTitle: {
        fontWeight: "400",
        fontSize: "13pt",
    },
}));

const ActiveParty = React.memo(function ActiveParty(props) {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12} className={classes.activePartyTitle}>
                {`${props.label} ${props.children.length}/${props.maxSize}`}
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="space-around" className={classes.activeParty}>
                    {props.children.map((value, index) =>
                        <UserPokCard
                            style={{ minWidth: "190px" }}
                            key={index}
                            index={index}

                            attr={props.attr}

                            moveTable={props.moveTable}
                            pokemonTable={props.pokemonTable}

                            onClick={props.onPokemonDelete}

                            {...value}
                        />)}
                </Grid>
            </Grid>
        </Grid>
    )
});

export default ActiveParty;

ActiveParty.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.arrayOf(PropTypes.node),
    ]),

    onPokemonDelete: PropTypes.func,

    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,

    attr: PropTypes.string,

    maxSize: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};