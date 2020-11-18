
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

import LinearProgress from '@material-ui/core/LinearProgress';

const NotFound = lazy(() => import("../NotFound/NotFound"))
const PvePage = lazy(() => import("./PvePage.jsx"))

class PveRouter extends React.Component {
    render() {
        return (
            <Suspense fallback={<LinearProgress color="secondary" />}>
                <Switch>
                    <Route path="/pve/:type(common)/:attacker/:boss/:obj/:supp" component={PvePage} />
                    <Route path="/pve/:type(common)/:attacker/:boss/:obj" component={PvePage} />
                    <Route path="/pve/:type(common|custom)/" component={PvePage} />
                    <Route path="/pve/:type(common|custom)/*" component={PvePage} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        )
    }
}

export default PveRouter