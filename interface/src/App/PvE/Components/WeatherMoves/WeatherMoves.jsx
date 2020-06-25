import React from "react";
import { weatherDecoder } from "../../../../js/indexFunctions"
import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"



const WeatherMoves = React.memo(function (props) {
    return (
        <>
            {weatherDecoder[props.pokQick.MoveType] === props.snapshot.pveObj.Weather &&
                <PokemonIconer
                    folder="/weather/"
                    src={props.snapshot.pveObj.Weather}
                    class={"icon18"} />
            }
            <div className={"mr-1 align-self-center font90 pveMove typeColor color" + props.pokQick.MoveType + " text"}>
                {props.pokQick.Title}
            </div>
            {weatherDecoder[props.pokCh.MoveType] === props.snapshot.pveObj.Weather &&
                <PokemonIconer
                    folder="/weather/"
                    src={props.snapshot.pveObj.Weather}
                    class={"icon18"} />
            }
            <div className={"align-self-center font90 pveMove typeColor color" + props.pokCh.MoveType + " text"}>
                {props.pokCh.Title}
            </div>
        </>
    )
});

export default WeatherMoves;