import React from "react"
import ReactTooltip from "react-tooltip"

import PokemonIconer from "../../../../../PvP/components/PokemonIconer/PokemonIconer"
import CloseButton from "../../../../../PvP/components/MagicBox/CloseButton"

import { ReactComponent as Shadow } from "../../../../../../icons/shadow.svg"

import "./UserPokCard.scss"

const UserPokCard = React.memo(function (props) {
    console.log(props)
    return (
        <div className="ushinycard col-auto my-1 mx-1 d-flex align-items-center">
            <ReactTooltip
                className={"infoTip"}
                id={props.attr + props.value.Name} effect="solid"
                place={"top"}
                multiline={true} >
                {props.value.Name}
            </ReactTooltip>
            <div data-tip data-for={props.attr + props.value.Name} className="col-auto p-0 posRel">
                {props.pokemonTable[props.value.Name] && <PokemonIconer
                    src={props.pokemonTable[props.value.Name].Number +
                        (props.pokemonTable[props.value.Name].Forme !== "" ? "-" + props.pokemonTable[props.value.Name].Forme : "")}
                    class={"icon36 mr-1"}
                />}
                {props.value.IsShadow === "true" ? <Shadow className="posAbs icon18" style={{ right: "-3px" }} /> : null}
            </div>
            {props.onClick && <CloseButton attr={props.attr} index={props.index} className="close" onClick={props.onClick} />}
        </div>
    )
})

export default UserPokCard
