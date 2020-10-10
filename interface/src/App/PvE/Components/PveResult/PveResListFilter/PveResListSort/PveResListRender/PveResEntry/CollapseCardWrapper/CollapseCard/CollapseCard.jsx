import React from "react"
import WeatherMoves from "../../WeatherMoves/WeatherMoves"

import "./CollapseCard.scss"

const CollapseCard = React.memo(function (props) {
    return (
        <div className="coll-card col-12 m-0 p-0 p-2 my-1">
            <div className="col-12 d-flex align-items-center m-0 p-0">
                <WeatherMoves
                    pokQick={props.pokQick}
                    pokCh={props.pokCh}
                    weather={props.weather}
                />
            </div>
            <div className="col-12 m-0 p-0 mt-2">
                {props.children}
            </div>
        </div>
    )
});



export default CollapseCard;