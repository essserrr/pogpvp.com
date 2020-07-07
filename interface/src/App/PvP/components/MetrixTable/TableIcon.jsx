import React from "react";
import ReactTooltip from "react-tooltip";
import LocalizedStrings from 'react-localization';

import { ReactComponent as Shadow } from "../../../../icons/shadow.svg";
import PokemonIconer from "../PokemonIconer/PokemonIconer"

import { getCookie } from "../../../../js/indexFunctions.js"
import { locale } from "../../../../locale/locale"

let strings = new LocalizedStrings(locale);



const TableIcon = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    return (
        <>
            {(props.pok.IsShadow === "true") && <Shadow className="posAbs icon16" />}
            <PokemonIconer
                src={props.pokemonTable[props.pok.name].Number +
                    (props.pokemonTable[props.pok.name].Forme !== "" ? "-" + props.pokemonTable[props.pok.name].Forme : "")}
                class={"icon36"}
                for={props.pok.name + props.j + props.letter}
            />
            <ReactTooltip
                className={"infoTip"}
                id={props.pok.name + props.j + props.letter} effect='solid'
                place={"top"}
                multiline={true}
            >
                {props.pok.name + (props.pok.IsShadow === "true" ? " (" + strings.options.type.shadow + ")" : "")}
            </ReactTooltip>
            <div className="row m-0 p-0 justify-content-center">
                {props.pok.QuickMove.replace(/[a-z -]/g, '') + props.addStar(props.pok.name, props.pok.QuickMove)}

                {(props.pok.ChargeMove1 || props.pok.ChargeMove2) ? "+" : ""}

                {props.pok.ChargeMove1 ? (props.pok.ChargeMove1.replace(/[a-z -]/g, '') + props.addStar(props.pok.name, props.pok.ChargeMove1)) : ""}

                {(props.pok.ChargeMove1 && props.pok.ChargeMove2) ? "/" : ""}

                {props.pok.ChargeMove2 ? (props.pok.ChargeMove2.replace(/[a-z -]/g, '') + props.addStar(props.pok.name, props.pok.ChargeMove2)) : ""}
            </div>
        </>
    )

});

export default TableIcon