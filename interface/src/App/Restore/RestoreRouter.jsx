
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

import LinearProgress from '@material-ui/core/LinearProgress';

const Restore = lazy(() => import("./Restore"))
const Confirmation = lazy(() => import("./Confirmation/Confirmation"))

class RestoreRouter extends React.Component {
    render() {
        return (
            <Suspense fallback={<LinearProgress color="secondary" />}>
                <Switch>
                    <Route exact path="/restore/confirm/:type" component={Confirmation} />
                    <Route exact path="/restore" component={Restore} />
                </Switch>
            </Suspense>
        )
    }
}

export default RestoreRouter;