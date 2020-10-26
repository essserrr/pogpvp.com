import React from "react";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ColoredMove from "App/Components/ColoredMove/ColoredMove";
import CloseButton from "App/Components/CloseButton/CloseButton";
import Iconer from "App/Components/Iconer/Iconer";
import { calculateCP } from "js/indexFunctions";

import { ReactComponent as Shadow } from "icons/shadow.svg";

const useStyles = makeStyles((theme) => ({
    upokcard: {
        minWidth: "178px",
        padding: `${theme.spacing(1)}px`,
        margin: `${theme.spacing(1)}px`,

        borderRadius: "4px",
        border: `1px solid ${theme.palette.text.primary}`,
        cursor: "pointer",

        backgroundColor: "white",
        textAlign: "center",
        fontWeight: "bold",
    },

    upokcardContainer: {
        position: "relative",
    },

    upokcardShadow: {
        width: "18px",
        height: "18px",

        position: "absolute",
        right: "-3px",
    },
}));

const UserPokCard = React.memo(function UserPokCard(props) {
    const classes = useStyles();

    function onPokemonOpenWrapper() {
        props.onPokemonEdit({
            Name: props.Name, QuickMove: props.QuickMove, ChargeMove: props.ChargeMove, ChargeMove2: props.ChargeMove2,
            Lvl: props.Lvl, Atk: props.Atk, Def: props.Def, Sta: props.Sta, IsShadow: props.IsShadow, index: props.index
        })
    }

    function onClickWrapper(event) {
        if (props.onClick) {
            event.stopPropagation()
            props.onClick({ attr: props.attr, index: props.index })
        }
    }


    return (
        <Paper elevation={4} className={classes.upokcard}
            style={props.style}
            onClick={props.onPokemonEdit ? onPokemonOpenWrapper : null}>
            <Grid container alignItems="flex-start">

                <Tooltip title={<Typography color="inherit">{props.Name}</Typography>}>
                    <Grid item xs="auto" className={classes.upokcardContainer}>
                        {props.pokemonTable[props.Name] &&

                            <Iconer
                                folderName="/pokemons/"
                                fileName={props.pokemonTable[props.Name].Number + (props.pokemonTable[props.Name].Forme !== "" ? "-" + props.pokemonTable[props.Name].Forme : "")}
                                size={48}
                            />}
                        {String(props.IsShadow) === "true" && <Shadow className={classes.upokcardShadow} />}
                    </Grid>
                </Tooltip>

                <Grid item xs>
                    <Box>
                        {props.forCustomPve && `#${props.index + 1} `}
                        {`CP:${calculateCP(props.Name, props.Lvl, props.Atk, props.Def, props.Sta, props.pokemonTable)}`}
                    </Box>
                    <Box>
                        {`${props.Lvl}:${props.Atk}/${props.Def}/${props.Sta}`}
                    </Box>
                </Grid>

                {props.onClick && <CloseButton onClick={onClickWrapper} />}

            </Grid>

            <ColoredMove mt={1}
                type={props.moveTable[props.QuickMove].MoveType}
            >
                {props.QuickMove}
            </ColoredMove>
            <ColoredMove mt={1}
                type={props.moveTable[props.ChargeMove].MoveType}
            >
                {props.ChargeMove}
            </ColoredMove>
            {props.ChargeMove2 && props.moveTable[props.ChargeMove2] &&
                <ColoredMove mt={1}
                    type={props.moveTable[props.ChargeMove2].MoveType}
                >
                    {props.ChargeMove2}
                </ColoredMove>}
        </Paper>
    )
});

export default UserPokCard;

UserPokCard.propTypes = {
    onClick: PropTypes.func,
    onPokemonEdit: PropTypes.func,

    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,



    index: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),

    forCustomPve: PropTypes.bool,
    style: PropTypes.object,

    attr: PropTypes.string,


    Name: PropTypes.string,
    QuickMove: PropTypes.string,
    ChargeMove: PropTypes.string,
    ChargeMove2: PropTypes.string,

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

    IsShadow: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
};




