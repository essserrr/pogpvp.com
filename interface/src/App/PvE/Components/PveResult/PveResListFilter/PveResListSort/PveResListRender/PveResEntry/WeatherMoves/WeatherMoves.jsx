import React from "react"
import { weatherDecoder } from "../../../../../../../../../js/indexFunctions"

import ShortMove from "../../../../../../../../PvpRating/RMoveRow/ShortMove/ShortMove"

import "./WeatherMoves.scss"

const WeatherMoves = React.memo(function (props) {
    return (
        <>
            <ShortMove
                enableWeather={weatherDecoder[props.pokQick.MoveType] === props.weather}
                weather={props.weather}

                class={`weather-moves__move mr-1 type-color${props.pokQick.MoveType} text`}
                value={props.pokQick.Title}
            />
            <ShortMove
                enableWeather={weatherDecoder[props.pokCh.MoveType] === props.weather}
                weather={props.weather}

                class={`weather-moves__move type-color${props.pokCh.MoveType} text`}
                value={props.pokCh.Title}
            />
        </>
    )
});

export default WeatherMoves;