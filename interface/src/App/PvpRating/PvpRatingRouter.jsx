
import React from "react";
import PvpRating from "./PvpRating.jsx";
import { Switch, Route } from "react-router-dom";

const PvpRatingRouter = () => (

    <Switch>
        <Route path="/pvprating/:league(great|ultra|master|premier|premierultra)/:type(overall|00|11|22|01|12)"
            component={PvpRating} />
        <Route path="/pvprating/*" component={PvpRating} />
        <Route path="/pvprating" component={PvpRating} />
    </Switch>

)

export default PvpRatingRouter