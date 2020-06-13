import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";

const PvpRouter = lazy(() => import('./PvP/PvpRouter.jsx'));
const IndexPageRouter = lazy(() => import('./IndexPage/IndexPageRouter.jsx'));
const NewsPageRouter = lazy(() => import('./IndexPage/NewsPageRouter.jsx'));
const NewsRouter = lazy(() => import('./IndexPage/NewsRouter.jsx'));
const ShinyRates = lazy(() => import('./ShinyRates/ShinyRates.jsx'));
const Evolve = lazy(() => import('./Evolve/Evolve'));
const RaidsList = lazy(() => import('./RaidsList/RaidsList'));
const EggsList = lazy(() => import('./EggsList/EggsList'));
const PvpRatingRouter = lazy(() => import('./PvpRating/PvpRatingRouter'));
const NotFound = lazy(() => import('./NotFound/NotFound'));

const Main = () => (
    <main>
        <Suspense fallback={<div className="row justify-content-center text-white">
            <div className=" col-auto mt-1  mt-md-2" style={{ fontWeight: "500", color: "white" }} >
                {"Loading..."}
                <BarLoader
                    color={"white"}
                    loading={true}
                />
            </div>
        </div>}>
            <Switch>
                <Route exact path='/' component={IndexPageRouter} />
                <Route path='/news/id' component={NewsRouter} />
                <Route path='/news' component={NewsPageRouter} />
                <Route path='/pvp' component={PvpRouter} />
                <Route path='/shinyrates' component={ShinyRates} />
                <Route path='/evolution' component={Evolve} />
                <Route path='/raids' component={RaidsList} />
                <Route path='/eggs' component={EggsList} />
                <Route path='/pvprating' component={PvpRatingRouter} />
                <Route path='*' component={NotFound} />
            </Switch>
        </Suspense>
    </main >
)

export default Main