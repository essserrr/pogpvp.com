import React from "react"
import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"

import "./ShortMove.scss"

const ShortMove = React.memo(function (props) {
    return (
        <>
            {props.enableWeather &&
                <PokemonIconer
                    folder="/weather/"
                    src={props.weather}
                    class={"icon18 "} />
            }
            <div className={`short-move ${props.enableMargins ? "short-move--margin" : ""} ${props.class ? props.class : ""}`} >
                {props.value}
            </div >
        </>
    )
});

export default ShortMove;