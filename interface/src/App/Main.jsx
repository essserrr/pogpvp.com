import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Loader from "./PvpRating/Loader";

import { getCookie } from "../js/getCookie";
import { loaderLocale } from "../locale/loaderLocale";

let strings = new LocalizedStrings(loaderLocale)


const PvpRouter = lazy(() => import("./PvP/PvpRouter.jsx"))
const PveRouter = lazy(() => import("./PvE/PveRouter.jsx"))
const IndexPageRouter = lazy(() => import("./IndexPage/IndexRouter.jsx"))
const NewsPageRouter = lazy(() => import("./IndexPage/NewsPageRouter.jsx"))
const NewsRouter = lazy(() => import("./IndexPage/NewsRouter.jsx"))
const ShinyRates = lazy(() => import("./ShinyRates/ShinyRates.jsx"))
const Evolve = lazy(() => import("./Evolve/Evolve"))
const RaidsList = lazy(() => import("./RaidsList/RaidsList"))
const EggsList = lazy(() => import("./EggsList/EggsList"))
const PvpRatingRouter = lazy(() => import("./PvpRating/PvpRatingRouter"))
const MovedexRouter = lazy(() => import("./Movedex/MovedexRouter"))
const PokedexRouter = lazy(() => import("./Pokedex/PokedexRouter"))
const NotFound = lazy(() => import("./NotFound/NotFound"))
const Registration = lazy(() => import("./Registration/Registration"))
const Privacy = lazy(() => import("./Registration/Privacy/Privacy"))
const Terms = lazy(() => import("./Registration/Terms/Terms"))
const UserpageRouter = lazy(() => import("./Userpage/UserpageRouter"))
const Login = lazy(() => import("./Login/Login"))
const RestoreRouter = lazy(() => import("./Restore/RestoreRouter"))
const ShinyBroker = lazy(() => import("./ShinyBroker/ShinyBroker"))

const useStyles = makeStyles((theme) => ({
    mainPadding: {
        paddingRight: "24px",
        paddingLeft: "24px",
        [theme.breakpoints.down('md')]: {
            paddingRight: "16px",
            paddingLeft: "16px",
        },
        [theme.breakpoints.down('sm')]: {
            paddingRight: "4px",
            paddingLeft: "4px",
        },
    }
}));

const Main = function GreyPaper() {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const classes = useStyles();

    return (
        <Container component="main" className={classes.mainPadding}>
            <Suspense fallback={
                <Loader
                    color="white"
                    weight="500"
                    locale={strings.loading}
                    loading={true}

                    class="row justify-content-center text-white"
                    innerClass="col-auto mt-1  mt-md-2"
                />}>
                <Switch>
                    <Route exact path="/" component={IndexPageRouter} />
                    <Route exact path="/" component={NewsPageRouter} />
                    <Route path="/news/id" component={NewsRouter} />
                    <Route path="/news" component={NewsPageRouter} />
                    <Route path="/pvp" component={PvpRouter} />
                    <Route path="/pve" component={PveRouter} />
                    <Route path="/shinyrates" component={ShinyRates} />
                    <Route path="/evolution" component={Evolve} />
                    <Route path="/raids" component={RaidsList} />
                    <Route path="/eggs" component={EggsList} />
                    <Route path="/pvprating" component={PvpRatingRouter} />
                    <Route path="/movedex" component={MovedexRouter} />
                    <Route path="/pokedex" component={PokedexRouter} />
                    <Route path="/privacy" component={Privacy} />
                    <Route path="/terms" component={Terms} />
                    <Route path="/shinybroker" component={ShinyBroker} />

                    <PrivateRoute authed={!getCookie("sid")} path='/registration' dest="/profile/info" component={Registration} />
                    <PrivateRoute authed={!!getCookie("sid")} path='/profile' dest="/login" component={UserpageRouter} />
                    <PrivateRoute authed={!getCookie("sid")} path='/login' dest="/profile/info" component={Login} />
                    <PrivateRoute authed={!getCookie("sid")} path='/restore' dest="/profile/info" component={RestoreRouter} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        </Container>
    );
};

export default connect(state => ({ session: state.session, }))(Main)