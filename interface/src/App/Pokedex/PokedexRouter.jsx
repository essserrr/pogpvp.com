
import React from "react";
import Pokedex from "./Pokedex"
import PokeCard from "./PokeCard"
import { Switch, Route } from "react-router-dom";

const PokedexRouter = () => (
    <Switch>
        <Route path="/pokedex/id/:id" component={PokeCard} />
        <Route path="/pokedex/" component={Pokedex} />
        <Route path="/pokedex" component={Pokedex} />
    </Switch>
)
export default PokedexRouter