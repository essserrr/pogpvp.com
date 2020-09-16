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

                class={`weather-moves__move mr-1 typeColorC${props.pokQick.MoveType} text`}
                value={props.pokQick.Title}
            />
            <ShortMove
                enableWeather={weatherDecoder[props.pokCh.MoveType] === props.weather}
                weather={props.weather}

                class={`weather-moves__move typeColorC${props.pokCh.MoveType} text`}
                value={props.pokCh.Title}
            />
        </>
    )
});

export default WeatherMoves;