import React from "react";
import LocalizedStrings from "react-localization";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


import { locale } from "locale/News/News";
import { getCookie } from "js/getCookie";

let strings = new LocalizedStrings(locale);

const useStyles = makeStyles((theme) => ({
    root: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        backgroundColor: "#958ff1",
        backgroundImage: "linear-gradient(#97aaff, #8198fd, #778ffa)",
        color: "white",
        fontWeight: "500",
    },
    typography: {
        fontWeight: "500",
    }
}));

const IndexPageTitle = React.memo(function IndexPageTitle() {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container justify="center">
            <Grid item xs={12} className={classes.root}>
                <Typography variant="h4" className={classes.typography}>
                    {strings.title.latestnews}
                </Typography>
            </Grid>
        </Grid>
    )
});

export default IndexPageTitle;
