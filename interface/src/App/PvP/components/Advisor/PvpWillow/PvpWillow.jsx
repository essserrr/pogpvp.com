import React from "react";
import LocalizedStrings from "react-localization";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import Iconer from "App/Components/Iconer/Iconer";

import { advisor } from "locale/Pvp/Advisor/Advisor";
import { getCookie } from "js/getCookie";

const useStyles = makeStyles((theme) => ({
    bubble: {
        position: "absolute",
        bottom: "25px",

        maxWidth: "320px",

        textAlign: "justify",
    },
}));

let advisorStrings = new LocalizedStrings(advisor);

const PvpWillow = function PvpWillow(props) {
    advisorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en");
    const classes = useStyles();

    return (
        <Box clone position="relative">
            <Grid item xs={12} container justify="center" wrap="nowrap">

                <Iconer fileName="willow3" folderName="/" />

                <Paper className={classes.bubble} elevation={4}>
                    <Box clone px={1} py={1}>
                        <Typography variant="body2">
                            {advisorStrings.advisor.willow}
                        </Typography>
                    </Box>
                </Paper>

            </Grid>
        </Box>
    )
};

export default PvpWillow;
