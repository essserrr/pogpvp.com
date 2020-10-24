import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Main from "./Main.jsx"
import NavbarWrapper from "./NavbarWrapper/NavbarWrapper"
import Footer from "./Footer/Footer"

const useStyles = makeStyles((theme) => ({
    appGrid: {
        minHeight: "100vh",
    },
}));

const AppGrid = React.memo(function AppGrid() {
    const classes = useStyles();

    return (
        <Grid container direction="column" className={classes.appGrid}>
            <Grid item xs={"auto"}>
                <NavbarWrapper />
            </Grid>
            <Grid item xs>
                <Main />
            </Grid>
            <Grid item xs={"auto"}>
                <Footer />
            </Grid>
        </Grid>
    );
});

export default AppGrid;