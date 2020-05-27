
import React from 'react';
import IndexPage from './IndexPage.jsx';
import { Switch, Route } from 'react-router-dom';

const NewsPageRouter = () => (
    <Switch>
        <Route path='/news/page/:number' component={IndexPage} />
        <Route path='/news/*' component={IndexPage} />
        <Route path='/news' component={IndexPage} />
    </Switch>
)

export default NewsPageRouter