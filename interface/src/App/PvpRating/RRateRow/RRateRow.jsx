import React from "react";
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import { ReactComponent as Shadow } from "../../../icons/shadow.svg";
import { Link } from "react-router-dom"

const RRateRow = React.memo(function (props) {
    return (
        <Link style={{ color: "black" }} key={props.value.Name} name={props.pokName} to={props.onClickRedirect(props.value.Name)}
            className="row styleRating fBolder clickable animRating justify-content-between px-2 mb-1 mx-2 mx-md-3">
            <div className="col p-0 posRel">
                <PokemonIconer
                    src={props.pokemonTable[props.pokName].Number +
                        (props.pokemonTable[props.pokName].Forme !== "" ? "-" + props.pokemonTable[props.pokName].Forme : "")}
                    class={"icon24 mr-1 d-inline"} />
                {props.pokName}
                {(props.pokName !== props.value.Name) && <Shadow className="allign-self-center icon24 py-1 ml-1" />}
            </div>
            <div className="col-auto p-0">
                {props.value.Rate}
            </div>
        </Link>
    )
});

export default RRateRow;