import React, { Suspense, lazy } from "react";
import LocalizedStrings from "react-localization";
import { Switch, Route } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import GreyPaper from '../Components/GreyPaper';
import UserPageTabs from "./UserPageTabs/UserPageTabs";
import SiteHelm from "../SiteHelm/SiteHelm";

import "./Userpage.scss";

import { getCookie } from "../../js/getCookie";
import { userLocale } from "../../locale/userLocale";

const Info = lazy(() => import("./Info/Info"));
const Security = lazy(() => import("./Security/Security"));
const CustomPokemon = lazy(() => import("./CustomPokemon/CustomPokemon"));
const CustomMoves = lazy(() => import("./CustomMoves/CustomMoves"));
const UserShinyBroker = lazy(() => import("./UserShinyBroker/UserShinyBroker"));

let strings = new LocalizedStrings(userLocale);

const useStyles = makeStyles((theme) => ({
    userpageTitle: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    container: {
        padding: "24px",
        paddingLeft: "24px",
        [theme.breakpoints.down('md')]: {
            paddingRight: "16px",
            paddingLeft: "16px",
        },
        [theme.breakpoints.down('sm')]: {
            paddingRight: "8px",
            paddingLeft: "8px",
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
                    <Grid item xs={"auto"}>
                        <UserPageTabs activePath={props.match.params.type} />
                    </Grid>
                    <Grid item xs>
                        <Container className={classes.container}>
                            <Suspense >
                                <Switch>
                                    <Route path="/profile/pokemon" component={CustomPokemon} />
                                    <Route path="/profile/move" component={CustomMoves} />
                                    <Route path="/profile/shinybroker" component={UserShinyBroker} />
                                    <Route path="/profile/info" component={Info} />
                                    <Route path="/profile/security" component={Security} />
                                </Switch>
                            </Suspense>
                        </Container>
                    </Grid>
                </Grid>
            </GreyPaper>
        </Grid>
    );
});


export default Userpage;

