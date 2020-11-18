
import React, { Suspense, lazy } from "react"
import { Switch, Route } from "react-router-dom"

import LinearProgress from '@material-ui/core/LinearProgress';

const NotFound = lazy(() => import("../NotFound/NotFound"))
const Userpage = lazy(() => import("./Userpage"))

class UserpageRouter extends React.Component {
    render() {
        return (
            <Suspense fallback={<LinearProgress color="secondary" />}>
                <Switch>
                    <Route path="/profile/:type(info|security|pokemon|move|shinybroker)/" component={Userpage} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        )
    }
}

export default UserpageRouter