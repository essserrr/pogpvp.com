import React from "react";
import LocalizedStrings from "react-localization";
import { Switch, Route } from "react-router-dom";
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import UserPageTabs from "./UserPageTabs/UserPageTabs";
import SiteHelm from "App/SiteHelm/SiteHelm";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/UserPage";

import Info from "./Info/Info";
import Security from "./Security/Security";
import CustomPokemon from "./CustomPokemon/CustomPokemon";
import CustomMoves from "./CustomMoves/CustomMoves";
import UserShinyBroker from "./UserShinyBroker/UserShinyBroker";

let strings = new LocalizedStrings(userLocale);

const useStyles = makeStyles((theme) => ({
    userpageTitle: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    container: {
        padding: `${theme.spacing(3)}px ${theme.spacing(5)}px ${theme.spacing(3)}px ${theme.spacing(5)}px`,
        [theme.breakpoints.down('md')]: {
            paddingRight: `${theme.spacing(2)}px`,
            paddingLeft: `${theme.spacing(2)}px`,
        },
        [theme.breakpoints.down('sm')]: {
            paddingRight: `${theme.spacing(1)}px`,
            paddingLeft: `${theme.spacing(1)}px`,
        },
    },
}));

const Userpage = React.memo(function Userpage(props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Grid container justify="center">
            <SiteHelm
                url="https://pogpvp.com/profile"
                header={strings.pageheaders.usr}
                descr={strings.pagedescriptions.usr}
                noindex={true}
            />
            <GreyPaper elevation={4} >
                <Grid container>
                    <Grid item xs={12} className={classes.userpageTitle}>
                        <CardHeader title={strings.upage.prof} />
                    </Grid>
                    <Grid item xs={4} sm={3} md={2} lg={2}>
                        <UserPageTabs activePath={props.match.params.type} />
                    </Grid>
                    <Grid item xs={8} sm={9} md={10} lg={10}>
                        <Container className={classes.container}>
                            <Switch>
                                <Route path="/profile/pokemon" component={CustomPokemon} />
                                <Route path="/profile/move" component={CustomMoves} />
                                <Route path="/profile/shinybroker" component={UserShinyBroker} />
                                <Route path="/profile/info" component={Info} />
                                <Route path="/profile/security" component={Security} />
                            </Switch>
                        </Container>
                    </Grid>
                </Grid>
            </GreyPaper>
        </Grid>
    );
});


export default Userpage;

Userpage.propTypes = {
    match: PropTypes.object.isRequired,
};