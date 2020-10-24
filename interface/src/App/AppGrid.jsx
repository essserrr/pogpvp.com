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
    footerMargin: {
        marginTop: "30px",
        [theme.breakpoints.down('md')]: {
            marginTop: "50px",
        }
    },
    navbarMargin: {
        marginBottom: "25px",
        [theme.breakpoints.down('md')]: {
            marginBottom: "25px",
        }
    }
}));

const AppGrid = function AppGrid() {
    const classes = useStyles();

    return (
        <Grid container direction="column" className={classes.appGrid}>
            <Grid item xs={"auto"} className={classes.navbarMargin}>
                <NavbarWrapper />
            </Grid>
            <Grid item xs>
                <Main />
            </Grid>
            <Grid item xs={"auto"} className={classes.footerMargin}>
                <Footer />
            </Grid>
        </Grid>
    );
};

export default AppGrid;