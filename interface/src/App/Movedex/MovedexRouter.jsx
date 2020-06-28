
import React from 'react';
import ShinyRates from './Movedex'
import { Switch, Route } from 'react-router-dom';

const NewsRouter = () => (
    <Switch>
        <Route path='/movedex/' component={ShinyRates} />
        <Route path='/movedex' component={ShinyRates} />
    </Switch>
)
//<Route path='/news/id/:id*' component={News} />
export default NewsRouter