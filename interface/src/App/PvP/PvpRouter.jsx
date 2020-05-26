
import React from 'react';
import PvpPage from './PvpPage.jsx';
import { Switch, Route } from 'react-router-dom';

const PvpRouter = () => (

    <Switch>
        <Route path='/pvp/:type/:league/:pok1/:pok2/:simtype' component={PvpPage} />
        <Route path='/pvp/:type/:league/:pok1/:pok2' component={PvpPage} />
        <Route path='/pvp/:type/' component={PvpPage} />
        <Route path='/pvp/:type/*' component={PvpPage} />
        <Route path='/pvp' component={PvpPage} />
    </Switch>

)

export default PvpRouter