import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import PrivateRoute from "PrivateRoute/PrivateRoute";
import { getCookie } from "js/getCookie";

const PvpRouter = lazy(() => import("./PvP/PvpRouter.jsx"))
const PveRouter = lazy(() => import("./PvE/PveRouter.jsx"))
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
        paddingRight: `${theme.spacing(3)}px`,
        paddingLeft: `${theme.spacing(3)}px`,
        [theme.breakpoints.down('md')]: {
            paddingRight: `${theme.spacing(2)}px`,
            paddingLeft: `${theme.spacing(2)}px`,
        },
        [theme.breakpoints.down('sm')]: {
            paddingRight: `${theme.spacing(0.5)}px`,
            paddingLeft: `${theme.spacing(0.5)}px`,
        },
    }
}));

const Main = function GreyPaper() {
    const classes = useStyles();

    return (
        <Container component="main" className={classes.mainPadding}>
            <Suspense fallback={<LinearProgress color="secondary" />}>
                <Switch>
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