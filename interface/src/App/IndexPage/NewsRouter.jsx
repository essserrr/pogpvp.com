
import React from 'react';
import NewsWrap from './NewsWrap.jsx';
import { Switch, Route } from 'react-router-dom';

const NewsRouter = () => (
    <Switch>
        <Route path='/news/id/:id' component={NewsWrap} />
        <Route path='/news/id/*' component={NewsWrap} />
        <Route path='/news/id' component={NewsWrap} />
    </Switch>
)

export default NewsRouter