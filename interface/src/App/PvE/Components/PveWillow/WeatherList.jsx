import React from "react";

import { weather } from "../../../../js/indexFunctions"
import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"


class WeatherList extends React.PureComponent {
    weatherList() {
        let arr = []
        for (const [key] of Object.entries(weather[this.props.weather])) {
            arr.push(
                <PokemonIconer
                    key={key}
                    folder="/type/"
                    src={key}
                    class={"ml-1 icon18"} />
            )
        }
        return arr
    }
    render() {
        return (
            this.weatherList()
        )
    }

}


export default WeatherList;