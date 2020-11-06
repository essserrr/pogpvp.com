
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

import LinearProgress from '@material-ui/core/LinearProgress';

const NotFound = lazy(() => import("../NotFound/NotFound"))
const PvpPage = lazy(() => import("./PvpPage.jsx"))

class PvpRouter extends React.Component {
    render() {
        return (
            <Suspense fallback={<LinearProgress color="secondary" />}>
                <Switch>
                    <Route path="/pvp/:type(matrix|single)/:league/:pok1/:pok2/:simtype" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/:league/:pok1/:pok2" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/:league/:pok1/" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/" component={PvpPage} />
                    <Route path="/pvp/:type(matrix|single)/*" component={PvpPage} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        )
    }
}

export default PvpRouter