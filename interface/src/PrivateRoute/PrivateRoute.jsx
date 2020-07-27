import React from "react";
import { Redirect, Route } from "react-router-dom";


function PrivateRoute({ component: Component, authed, dest, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{ pathname: dest, state: { from: props.location } }} />}
        />
    )
}

export default PrivateRoute