
import React from 'react';
import ShinyRates from './Movedex'
import MoveCard from "./MoveCard"
import { Switch, Route } from 'react-router-dom';

const MovedexRouter = () => (
    <Switch>
        <Route path='/movedex/id/:id' component={MoveCard} />
        <Route path='/movedex/' component={ShinyRates} />
        <Route path='/movedex' component={ShinyRates} />
    </Switch>
)
export default MovedexRouter