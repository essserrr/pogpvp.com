import React from "react"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import { ReactComponent as Shadow } from "../../../icons/shadow.svg"
import { Link } from "react-router-dom"

import "./RRateRow.scss"

const RRateRow = React.memo(function (props) {
    return (
        <Link style={{ color: "black" }} key={props.value.Name} name={props.pokName} to={props.onClickRedirect(props.value.Name)}
            className="rating-raterow row justify-content-between px-2 mb-1 mx-2 mx-md-3">
            <div className="col p-0">
                <PokemonIconer
                    src={props.pokemonTable[props.pokName].Number +
                        (props.pokemonTable[props.pokName].Forme !== "" ? "-" + props.pokemonTable[props.pokName].Forme : "")}
                    class={"rating-raterow__icon mr-1 d-inline"} />
                {props.pokName}
                {(props.pokName !== props.value.Name) && <Shadow className="rating-raterow__icon allign-self-center py-1 ml-1" />}
            </div>
            <div className="col-auto p-0">
                {props.value.Rate}
            </div>
        </Link>
    )
});

export default RRateRow;