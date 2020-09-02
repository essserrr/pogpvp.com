import React from "react"
import ReactTooltip from "react-tooltip"

import PokemonIconer from "../../../../../PvP/components/PokemonIconer/PokemonIconer"
import CloseButton from "../../../../../PvP/components/MagicBox/CloseButton"

import { ReactComponent as Shadow } from "../../../../../../icons/shadow.svg"

import "./UserPokCard.scss"

const UserPokCard = React.memo(function (props) {

    function onPokemonOpenWrapper(event) {
        if (event.target.getAttribute("name") === "closeButton") {
            return
        }
        props.onPokemonEdit({ ...props.value, index: props.index })
    }

    return (
        <div onClick={onPokemonOpenWrapper} className="upokcard col-auto p-1 my-1 mx-1 mx-md-4 text-center">
            <div className="mx-1 mb-1 row align-items-center">
                <ReactTooltip
                    className={"infoTip"}
                    id={props.attr + props.value.Name} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {props.value.Name}
                </ReactTooltip>
                <div data-tip data-for={props.attr + props.value.Name} className="col-auto px-0 posRel">
                    {props.pokemonTable[props.value.Name] && <PokemonIconer
                        src={props.pokemonTable[props.value.Name].Number +
                            (props.pokemonTable[props.value.Name].Forme !== "" ? "-" + props.pokemonTable[props.value.Name].Forme : "")}
                        class={"icon36 mr-1"}
                    />}
                    {props.value.IsShadow === "true" ? <Shadow className="posAbs icon18" style={{ right: "-3px" }} /> : null}
                </div>
                <div className="col px-2">
                    <div>{`${props.value.Lvl}:${props.value.Atk}/${props.value.Def}/${props.value.Sta}`}</div>
                    <div>{`CP:${props.value.CP}`}</div>
                </div>
                {props.onClick && <CloseButton attr={props.attr} index={props.index} className="close" onClick={props.onClick} />}
            </div>

            <div className={"col-12 mb-1  moveStyle typeColorC" + props.moveTable[props.value.QuickMove].MoveType + " text"} >
                {props.value.QuickMove}
            </div>
            <div className={"col-12  moveStyle typeColorC" + props.moveTable[props.value.ChargeMove].MoveType + " text"}>
                {props.value.ChargeMove}
            </div>
            {props.value.ChargeMove2 && props.moveTable[props.value.ChargeMove2] &&
                <div className={"col-12 mt-1  moveStyle typeColorC" + props.moveTable[props.value.ChargeMove2].MoveType + " text"}>
                    {props.value.ChargeMove2}
                </div>}
        </div>
    )
})

export default UserPokCard
