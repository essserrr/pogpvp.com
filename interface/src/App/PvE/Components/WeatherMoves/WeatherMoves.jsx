import React from "react"
import { weatherDecoder } from "../../../../js/indexFunctions"

import ShortMove from "../../../PvpRating/RMoveRow/ShortMove/ShortMove"

const WeatherMoves = React.memo(function (props) {
    return (
        <>
            <ShortMove
                enableWeather={weatherDecoder[props.pokQick.MoveType] === props.weather}
                weather={props.weather}

                class={`mr-1 font90 typeColorC${props.pokQick.MoveType} text`}
                value={props.pokQick.Title}
            />
            <ShortMove
                enableWeather={weatherDecoder[props.pokCh.MoveType] === props.weather}
                weather={props.weather}

                class={`font90 typeColorC${props.pokCh.MoveType} text`}
                value={props.pokCh.Title}
            />
        </>
    )
});

export default WeatherMoves;