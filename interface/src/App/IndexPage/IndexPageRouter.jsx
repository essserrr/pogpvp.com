
import React from 'react';
import IndexPage from './IndexPage.jsx';
import { Switch, Route } from 'react-router-dom';

const IndexPageRouter = () => (
    <Switch>
        <Route exact path='/' component={IndexPage} />
    </Switch>
)

export default IndexPageRouter