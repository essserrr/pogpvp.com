
import React, { Suspense, lazy } from 'react';
import BarLoader from "react-spinners/BarLoader";
import { Switch, Route } from 'react-router-dom';

const NotFound = lazy(() => import('../NotFound/NotFound'));
const PvpPage = lazy(() => import('./PvpPage.jsx'));

const PvpRouter = () => (
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
            <Route path='/pvp/:type(matrix|single)/:league/:pok1/:pok2/:simtype' component={PvpPage} />
            <Route path='/pvp/:type(matrix|single)/:league/:pok1/:pok2' component={PvpPage} />
            <Route path='/pvp/:type(matrix|single)/' component={PvpPage} />
            <Route path='/pvp/:type(matrix|single)/*' component={PvpPage} />
            <Route path='*' component={NotFound} />
        </Switch>
    </Suspense>
)

export default PvpRouter