import React from "react"

import PokemonIconer from "../../../../../App/PvP/components/PokemonIconer/PokemonIconer"
import CloseButton from "../../../../PvP/components/MagicBox/CloseButton"

import "./UserShinyCard.scss"

const UserShinyCard = React.memo(function (props) {
    return (
        <div className="ushinycard col-auto my-1 mr-2 d-flex align-items-center">
            {`${props.value.Amount}X`}
            <PokemonIconer
                src={props.pokemonTable[props.value.Name].Number +
                    (props.pokemonTable[props.value.Name].Forme !== "" ? "-" + props.pokemonTable[props.value.Name].Forme : "")}
                class={"icon36 mr-1"}
            />
            <CloseButton attr={props.attr} index={props.value.Name} className="close" onClick={props.onLick} />
        </div>
    )
})

export default UserShinyCard
