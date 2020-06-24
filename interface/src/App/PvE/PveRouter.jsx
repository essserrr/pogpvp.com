
import React, { Suspense, lazy } from 'react';
import Loader from "../PvpRating/Loader"
import { Switch, Route } from 'react-router-dom';

const NotFound = lazy(() => import('../NotFound/NotFound'));
const PvePage = lazy(() => import('./PvePage.jsx'));

const PveRouter = () => (
    <Suspense fallback={<Loader
        color="white"
        weight="500"
        locale="Loading..."
        loading={true}

        class="row justify-content-center text-white"
        innerClass="col-auto mt-1  mt-md-2"
    />}>
        <Switch>
            <Route path='/pve/:type(common)/:attacker/:boss/:obj' component={PvePage} />
            <Route path='/pve/:type(common)/' component={PvePage} />
            <Route path='/pve/:type(common)/*' component={PvePage} />
            <Route path='*' component={NotFound} />
        </Switch>
    </Suspense>
)

export default PveRouter