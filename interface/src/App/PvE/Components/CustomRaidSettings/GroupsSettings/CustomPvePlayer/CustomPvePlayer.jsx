import React from "react";
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import PlayerParty from "./PlayerParty/PlayerParty";
import CloseButton from "App/Components/CloseButton/CloseButton";

import { pveLocale } from "locale/Pve/CustomPve/CustomPve";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(pveLocale);

const useStyles = makeStyles((theme) => ({
    title: {
        borderBottom: `1px solid ${theme.palette.text.primary}`,
    },
}));

const CustomPvePlayer = React.memo(function CustomPvePlayer(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    const list = [{ value: "", title: strings.none }, ...Object.keys(props.userParties).map((value) => ({ value: value, title: value }))];

    return (
        <Grid container justify="center" alignItems="center" spacing={1}>

            <Grid item xs={12} container justify="space-between" className={classes.title}>
                <Typography variant="h6">
                    {`${strings.player} ${props.playerNumber + 1}`}
                </Typography>


                {props.playerNumber !== 0 &&
                    <CloseButton onClick={(event, ...other) => props.onChange(event, { attr: "deletePlayer", index: props.playerNumber }, ...other)} />}
            </Grid>

            <Grid item xs={4}>
                <PlayerParty
                    list={list}
                    value={props.group1.title}
                    partyNumber={0}
                    playerNumber={props.playerNumber}

                    onChange={props.onChange}
                />
            </Grid>

            <Grid item xs={4}>
                <PlayerParty
                    list={list}
                    value={props.group2.title}
                    partyNumber={1}
                    playerNumber={props.playerNumber}

                    onChange={props.onChange}
                />
            </Grid>

            <Grid item xs={4}>
                <PlayerParty
                    list={list}
                    value={props.group3.title}
                    partyNumber={2}
                    playerNumber={props.playerNumber}

                    onChange={props.onChange}
                />
            </Grid>
        </Grid>
    )
});


export default CustomPvePlayer;

CustomPvePlayer.propTypes = {
    playerNumber: PropTypes.number,
    group1: PropTypes.object,
    group2: PropTypes.object,
    group3: PropTypes.object,
    userParties: PropTypes.object,
    onChange: PropTypes.func,
};