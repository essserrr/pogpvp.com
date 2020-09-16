import React from "react"
import ReactTooltip from "react-tooltip"

import PokemonIconer from "../../../../PvP/components/PokemonIconer/PokemonIconer"
import CloseButton from "../../../../PvP/components/MagicBox/CloseButton"

import { ReactComponent as Shiny } from "../../../../../icons/shiny.svg"

import "./UserShinyCard.scss"

const UserShinyCard = React.memo(function (props) {
    return (
        <div className="ushinycard col-auto my-1 mx-1 d-flex align-items-center">
            {props.value.Amount && `${props.value.Amount}X`}
            <ReactTooltip
                className={"infoTip"}
                id={props.attr + props.value.Name} effect="solid"
                place={"top"}
                multiline={true} >
                {props.value.Name}
            </ReactTooltip>
            <div data-tip data-for={props.attr + props.value.Name} className="ushinycard__container col-auto p-0">
                {props.pokemonTable[props.value.Name] && <PokemonIconer
                    src={props.pokemonTable[props.value.Name].Number +
                        (props.pokemonTable[props.value.Name].Forme !== "" ? "-" + props.pokemonTable[props.value.Name].Forme : "")}
                    class={"ushinycard__pok mr-1"}
                />}
                {props.value.Type === "Shiny" ? <Shiny className="ushinycard__shiny" /> : null}
            </div>
            {props.onClick && <CloseButton attr={props.attr} index={props.value.Name} className="close" onClick={props.onClick} />}
        </div>
    )
})

export default UserShinyCard
