import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import Loader from "./PvpRating/Loader"


const PvpRouter = lazy(() => import("./PvP/PvpRouter.jsx"));
const PveRouter = lazy(() => import("./PvE/PveRouter.jsx"));
const IndexPageRouter = lazy(() => import("./IndexPage/IndexRouter.jsx"));
const NewsPageRouter = lazy(() => import("./IndexPage/NewsPageRouter.jsx"));
const NewsRouter = lazy(() => import("./IndexPage/NewsRouter.jsx"));
const ShinyRates = lazy(() => import("./ShinyRates/ShinyRates.jsx"));
const Evolve = lazy(() => import("./Evolve/Evolve"));
const RaidsList = lazy(() => import("./RaidsList/RaidsList"));
const EggsList = lazy(() => import("./EggsList/EggsList"));
const PvpRatingRouter = lazy(() => import("./PvpRating/PvpRatingRouter"));
const MovedexRouter = lazy(() => import("./Movedex/MovedexRouter"));
const PokedexRouter = lazy(() => import("./Pokedex/PokedexRouter"));
const NotFound = lazy(() => import("./NotFound/NotFound"));
const Registration = lazy(() => import("./Registration/Registration"));
const Privacy = lazy(() => import("./Registration/Privacy/Privacy"));
const Terms = lazy(() => import("./Registration/Terms/Terms"));
const Userpage = lazy(() => import("./Userpage/Userpage"));
const Login = lazy(() => import("./Login/Login"));

const Main = () => (
    <main>
        <Suspense fallback={
            <Loader
                color="white"
                weight="500"
                locale="Loading..."
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
                <Route path="/registration" component={Registration} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/terms" component={Terms} />
                <Route path="/profile" component={Userpage} />
                <Route path="/login" component={Login} />
                <Route path="*" component={NotFound} />
            </Switch>
        </Suspense>
    </main >
)

export default Main