import React from "react"
import { weatherDecoder } from "js/coders/weatherDecoder";

import ColoredMove from "App/Components/ColoredMove/ColoredMove"

import "./WeatherMoves.scss"

const WeatherMoves = React.memo(function (props) {
    return (
        <>
            <ColoredMove m={0.5}
                weather={weatherDecoder[props.pokQick.MoveType] === props.weather ? props.weather : undefined}
                type={props.pokQick.MoveType}
            >
                {props.pokQick.Title}
            </ColoredMove>
            <ColoredMove m={0.5}
                weather={weatherDecoder[props.pokCh.MoveType] === props.weather ? props.weather : undefined}
                type={props.pokCh.MoveType}
            >
                {props.pokCh.Title}
            </ColoredMove>
        </>
    )
});

export default WeatherMoves;