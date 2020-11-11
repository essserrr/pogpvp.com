import React from "react"
import ReactTooltip from "react-tooltip"

import { typeDecoder } from "js/indexFunctions"
import PokemonIconer from "App/PvP/components/PokemonIconer/PokemonIconer"


const EffIcon = React.memo(function (props) {
    return (
        <>
            <PokemonIconer
                folder="/type/"
                src={props.i}
                class={"icon36 mx-1"}
                for={props.i + "effIcon"}
            />
            <ReactTooltip
                className={"infoTip"}
                id={props.i + "effIcon"} effect="solid"
                place={"top"}
                multiline={true}
            >
                {typeDecoder[props.i] + " " + props.eff}
            </ReactTooltip>
        </>
    )
});

export default EffIcon;