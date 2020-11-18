import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Main from "./Main.jsx";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const useStyles = makeStyles((theme) => ({
    appGrid: {
        minHeight: "100vh",
    },
    footerMargin: {
        marginTop: `${theme.spacing(4)}px`,
        [theme.breakpoints.down('md')]: {
            marginTop: `${theme.spacing(6)}px`,
        }
    },
    navbarMargin: {
        marginBottom: `${theme.spacing(3)}px`,
        [theme.breakpoints.down('md')]: {
            marginBottom: `${theme.spacing(3)}px`,
        }
    }
}));

const AppGrid = function AppGrid() {
    const classes = useStyles();

    return (
        <Grid container direction="column" className={classes.appGrid}>
            <Grid item xs={"auto"} className={classes.navbarMargin}>
                <Navbar />
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