import React from "react";
import NewsPages from "./NewsPages";
import { Switch, Route } from "react-router-dom";

const IndexPageRouter = () => (
    <Switch>
        <Route exact path="/" component={NewsPages} />
    </Switch>
)

export default IndexPageRouter