
import React from 'react';
import Pokedex from './Pokedex'
import MoveCard from "./MoveCard"
import { Switch, Route } from 'react-router-dom';

const PokedexRouter = () => (
    <Switch>
        <Route path='/pokedex/id/:id' component={MoveCard} />
        <Route path='/pokedex/' component={Pokedex} />
        <Route path='/pokedex' component={Pokedex} />
    </Switch>
)
export default PokedexRouter