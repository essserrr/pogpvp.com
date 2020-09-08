import React from "react"
import ReactTooltip from "react-tooltip"

import PokemonIconer from "../../../../../../PvP/components/PokemonIconer/PokemonIconer"
import { ReactComponent as Shadow } from "../../../../../../../icons/shadow.svg"

const PreviewIcon = React.memo(function (props) {

    return (
        <>
            <ReactTooltip
                className={"infoTip"}
                id={props.index + props.attr + props.Name} effect="solid"
                place={"top"}
                multiline={true} >
                {props.Name}
            </ReactTooltip>
            <div data-tip data-for={props.index + props.attr + props.Name} className="col-auto px-2 posRel">
                {props.pokemonTable[props.Name] && <PokemonIconer
                    src={props.pokemonTable[props.Name].Number +
                        (props.pokemonTable[props.Name].Forme !== "" ? "-" + props.pokemonTable[props.Name].Forme : "")}
                    class={"icon48"}
                />}
                {String(props.IsShadow) === "true" && <Shadow className="posAbs icon18" style={{ right: "-3px" }} />}
            </div>
        </>
    )
})

export default PreviewIcon
