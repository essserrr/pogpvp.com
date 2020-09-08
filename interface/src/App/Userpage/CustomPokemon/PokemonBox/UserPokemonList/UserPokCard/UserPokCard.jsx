import React from "react"
import ReactTooltip from "react-tooltip"

import PokemonIconer from "../../../../../PvP/components/PokemonIconer/PokemonIconer"
import CloseButton from "../../../../../PvP/components/MagicBox/CloseButton"
import { calculateCP } from "../../../../../../js/indexFunctions"

import { ReactComponent as Shadow } from "../../../../../../icons/shadow.svg"

import "./UserPokCard.scss"

const UserPokCard = React.memo(function (props) {

    function onPokemonOpenWrapper(event) {
        if (event.target.getAttribute("name") === "closeButton") {
            return
        }

        props.onPokemonEdit({
            Name: props.Name, QuickMove: props.QuickMove, ChargeMove: props.ChargeMove, ChargeMove2: props.ChargeMove2,
            Lvl: props.Lvl, Atk: props.Atk, Def: props.Def, Sta: props.Sta, IsShadow: props.IsShadow, index: props.index
        })
    }

    return (
        <div className="upokcard col-auto p-1 my-1 mx-1 text-center"
            style={props.style}
            onClick={props.onPokemonEdit ? onPokemonOpenWrapper : null} >
            <div className="mx-1 mb-1 row align-items-center">
                <ReactTooltip
                    className={"infoTip"}
                    id={props.index + props.attr + props.Name} effect="solid"
                    place={"top"}
                    multiline={true} >
                    {props.Name}
                </ReactTooltip>
                <div data-tip data-for={props.index + props.attr + props.Name} className="col-auto px-0 posRel">
                    {props.pokemonTable[props.Name] && <PokemonIconer
                        src={props.pokemonTable[props.Name].Number +
                            (props.pokemonTable[props.Name].Forme !== "" ? "-" + props.pokemonTable[props.Name].Forme : "")}
                        class={"icon48 mr-1"}
                    />}
                    {String(props.IsShadow) === "true" && <Shadow className="posAbs icon18" style={{ right: "-3px" }} />}
                </div>
                <div className="col px-2">
                    <div>
                        {props.forCustomPve && `#${props.index + 1} `}
                        {`CP:${calculateCP(props.Name, props.Lvl, props.Atk, props.Def, props.Sta, props.pokemonTable)}`}
                    </div>
                    <div>{`${props.Lvl}:${props.Atk}/${props.Def}/${props.Sta}`}</div>
                </div>
                {props.onClick && <CloseButton attr={props.attr} index={props.index} className="close" onClick={props.onClick} />}
            </div>
            <div className={"col-12 px-1  mb-1  moveStyle typeColorC" + props.moveTable[props.QuickMove].MoveType + " text"} >
                {props.QuickMove}
            </div>
            <div className={"col-12 px-1  moveStyle typeColorC" + props.moveTable[props.ChargeMove].MoveType + " text"}>
                {props.ChargeMove}
            </div>
            {props.ChargeMove2 && props.moveTable[props.ChargeMove2] &&
                <div className={"col-12 px-1 mt-1  moveStyle typeColorC" + props.moveTable[props.ChargeMove2].MoveType + " text"}>
                    {props.ChargeMove2}
                </div>}
        </div>
    )
})

export default UserPokCard
