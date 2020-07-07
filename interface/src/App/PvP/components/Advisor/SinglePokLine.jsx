import React from "react";
import ReactTooltip from "react-tooltip";
import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";
import PokemonIconer from "../PokemonIconer/PokemonIconer"
import { returnVunStyle } from "../../..//../js/indexFunctions"


const SinglePokLine = React.memo(function (props) {
    return (
        <>
            <td className="modifiedBorderTable text-center theadT fixFirstRow m-0 p-0 px-1" >
                {(props.pok.IsShadow === "true") && <Shadow className="posAbs icon16" />}
                <PokemonIconer
                    src={props.pokemonTable[props.pok.name].Number +
                        (props.pokemonTable[props.pok.name].Forme !== "" ? "-" + props.pokemonTable[props.pok.name].Forme : "")}
                    class={"icon36"}
                    for={props.pok.name + props.i + "R"}
                />
                <ReactTooltip
                    className={"infoTip"}
                    id={props.pok.name + props.i + "R"} effect='solid'
                    place={"right"}
                    multiline={true}
                >
                    {props.pok.name + (props.pok.IsShadow === "true" ? " (" + props.locale + ")" : "")}
                </ReactTooltip>
                <div className="row m-0 p-0 justify-content-center">
                    {props.pok.QuickMove.replace(/[a-z -]/g, '') + props.addStar(props.pok.name, props.pok.QuickMove)}
                    {(props.pok.ChargeMove1 || props.pok.ChargeMove2) ? "+" : ""}
                    {props.pok.ChargeMove1 ? (props.pok.ChargeMove1.replace(/[a-z -]/g, '') + props.addStar(props.pok.name, props.pok.ChargeMove1)) : ""}
                    {(props.pok.ChargeMove1 && props.pok.ChargeMove2) ? "/" : ""}
                    {props.pok.ChargeMove2 ? (props.pok.ChargeMove2.replace(/[a-z -]/g, '') + props.addStar(props.pok.name, props.pok.ChargeMove2)) : ""}
                </div>
            </td>
            {props.vun[props.i].map((elem, k) => {
                let rateStyle = returnVunStyle(elem)
                return <td key={props.i + "defensive" + k} className="modifiedBorderTable matrixColor defaultFont m-0 p-0 align-middle" >
                    <div className={"rateTyping hover rateColor " + rateStyle}>
                        {elem}
                    </div>
                </td >
            })}
        </>
    )
});

export default SinglePokLine;