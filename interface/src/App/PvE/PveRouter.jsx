
import React, { Suspense, lazy } from 'react';
import BarLoader from "react-spinners/BarLoader";
import { Switch, Route } from 'react-router-dom';

const NotFound = lazy(() => import('../NotFound/NotFound'));
const PvePage = lazy(() => import('./PvePage.jsx'));

const PveRouter = () => (
    <Suspense fallback={<div className="row justify-content-center text-white">
        <div className=" col-auto mt-1  mt-md-2" style={{ fontWeight: "500", color: "white" }} >
            {"Loading..."}
            <BarLoader
                color={"white"}
                loading={true}
            />
        </div>
    </div>}>
        <Switch>
            <Route path='/pve/:type(common)/:attacker/:boss/:obj' component={PvePage} />
            <Route path='/pve/:type(common)/' component={PvePage} />
            <Route path='/pve/:type(common)/*' component={PvePage} />
            <Route path='*' component={NotFound} />
        </Switch>
    </Suspense>
)

export default PveRouter