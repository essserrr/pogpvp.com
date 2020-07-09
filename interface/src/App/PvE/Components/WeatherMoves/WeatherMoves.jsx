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
                    class={"icon18 align-self-center"} />
            }
            <div className={"mr-1 align-self-center text-center font90 moveStyle typeColorC" + props.pokQick.MoveType + " text"}>
                {props.pokQick.Title}
            </div>
            {weatherDecoder[props.pokCh.MoveType] === props.snapshot.pveObj.Weather &&
                <PokemonIconer
                    folder="/weather/"
                    src={props.snapshot.pveObj.Weather}
                    class={"icon18 align-self-center"} />
            }
            <div className={"align-self-center text-center font90 moveStyle typeColorC" + props.pokCh.MoveType + " text"}>
                {props.pokCh.Title}
            </div>
        </>
    )
});

export default WeatherMoves;