
import React from "react";
import NewsPages from "./NewsPages.jsx";
import { Switch, Route } from "react-router-dom";

const NewsPageRouter = () => (
    <Switch>
        <Route exact path="/" component={NewsPages} />
        <Route path="/news/page/:number" component={NewsPages} />
        <Route path="/news/*" component={NewsPages} />
        <Route path="/news" component={NewsPages} />
    </Switch>
)

export default NewsPageRouter