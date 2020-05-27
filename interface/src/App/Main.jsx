
import React from 'react';
import PvpRouter from './PvP/PvpRouter.jsx';
import IndexPageRouter from './IndexPage/IndexPageRouter.jsx';
import NewsPageRouter from './IndexPage/NewsPageRouter.jsx';
import NewsRouter from './IndexPage/NewsRouter.jsx';
import ShinyRates from './ShinyRates/ShinyRates.jsx';
import Evolve from './Evolve/Evolve';
import RaidsList from './RaidsList/RaidsList';
import EggsList from './EggsList/EggsList';
import PvpRatingRouter from './PvpRating/PvpRatingRouter';
import { Switch, Route } from 'react-router-dom';

const Main = () => (
    <main>
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
        </Switch>
    </main>
)

export default Main