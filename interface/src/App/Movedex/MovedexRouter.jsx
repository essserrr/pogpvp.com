
import React from 'react';
import Movedex from './Movedex'
import MoveCard from "./MoveCard"
import { Switch, Route } from 'react-router-dom';

const MovedexRouter = () => (
    <Switch>
        <Route path='/movedex/id/:id' component={MoveCard} />
        <Route path='/movedex/' component={Movedex} />
        <Route path='/movedex' component={Movedex} />
    </Switch>
)
export default MovedexRouter