
import React from 'react';
import News from './News.jsx';
import { Switch, Route } from 'react-router-dom';

const NewsRouter = () => (
    <Switch>
        <Route path='/news/id/:id' component={News} />
        <Route path='/news/id/*' component={News} />
        <Route path='/news/id' component={News} />
    </Switch>
)

export default NewsRouter