import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Iconer from "App/Components/Iconer/Iconer";

const useStyles = makeStyles((theme) => ({
    window: {
        position: "relative",
        width: "85px",
        height: "95px",
        backgroundColor: "rgb(255, 255, 255)",
        zIndex: 2,
        overflow: "hidden",
        border: "3px solid black",
        borderRadius: "50%",
    },

    icon: {
        position: "absolute",
        width: "85px !important",
        zIndex: 1,
    },

    text: {
        fontSize: "90pt",
        fontWeight: "bold",

        color: "white",
        "-webkitTextStroke": "3px black",
    },
}));

const NotFoundIcon = React.memo(function NotFoundIcon() {
    const classes = useStyles();

    return (
        <Grid container justify="center" alignItems="center">
            <Box className={classes.text}>
                4
            </Box>
            <Box className={classes.window}>
                <Iconer
                    fileName={"404"}
                    folderName="/"
                    className={classes.icon} />
            </Box>
            <Box className={classes.text}>
                4
            </Box>
        </Grid>
    )
});

export default NotFoundIcon;
