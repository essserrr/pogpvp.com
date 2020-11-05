import React from "react";
import LocalizedStrings from "react-localization";
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Footer/Footer";

let strings = new LocalizedStrings(userLocale)

const useStyles = makeStyles((theme) => ({
    footer: {
        marginTop: `${theme.spacing(4)}px`,
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,

        fontStyle: "italic",
        fontFamily: `"Times New Roman", Times, serif`,
        color: theme.palette.text.primary,
        textAlign: "center",
        fontSize: "12px",
        lineHeight: "14px",

        [theme.breakpoints.down('md')]: {
            marginTop: `${theme.spacing(6)}`,
        }
    },
}));

const Footer = React.memo(function Footer() {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid data-nosnippet container justify="center" className={classes.footer}>
            <Grid item xs={12}>
                ©2020 pogPvP.com  <Link to="/privacy" title={strings.pol.p}>{strings.pol.p}</Link>  <Link to="/terms" title={strings.pol.t}>{strings.pol.t}</Link>
            </Grid>
            <Grid item xs={12}>
                Icons made by <a href="https://www.flaticon.com/authors/roundicons-freebies" title="Roundicons Freebies">Roundicons Freebies</a>
            </Grid>
            <Grid item xs={12}>
                Pokémon is Copyright Gamefreak, Nintendo and The Pokémon Company 2001-2018. All images and names owned and trademarked by Gamefreak, Nintendo, The Pokémon Company, and Niantic are property of their respective owners.
            </Grid>
        </Grid>
    );
});

export default Footer;

