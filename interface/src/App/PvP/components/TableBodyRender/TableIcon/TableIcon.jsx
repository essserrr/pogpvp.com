import React from "react"
import ReactTooltip from "react-tooltip"
import LocalizedStrings from "react-localization"

import { ReactComponent as Shadow } from "../../../../../icons/shadow.svg"
import Iconer from "App/Components/Iconer/Iconer";

import { getCookie } from "../../../../../js/getCookie"
import { pvp } from "../../../../../locale/Pvp/Pvp"

import "./TableIcon.scss"

let strings = new LocalizedStrings(pvp)

const TableIcon = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

    const fileName = props.pokemonTable[props.pok.name].Number + (props.pokemonTable[props.pok.name].Forme !== "" ? "-" + props.pokemonTable[props.pok.name].Forme : "")
    return (
        <div className="row m-0 justify-content-center ">
            <div className="table-icon__container" >
                {String(props.pok.IsShadow) === "true" && <Shadow className="table-icon__shadow" />}

                <Iconer folderName="/pokemons/" fileName={fileName} size={36} for={props.pok.name + props.j + props.letter} />

                <ReactTooltip
                    className={"infoTip"}
                    id={props.pok.name + props.j + props.letter} effect="solid"
                    place={"top"}
                    multiline={true}
                >
                    {props.pok.name + (props.pok.IsShadow === "true" ? " (" + strings.options.type.shadow + ")" : "")}
                </ReactTooltip>
            </div>
            <div className="col-12 p-0">
                {props.pok.QuickMove.replace(/[a-z -]/g, "") + props.addStar(props.pok.name, props.pok.QuickMove)}

                {(props.pok.ChargeMove1 || props.pok.ChargeMove2) ? "+" : ""}

                {props.pok.ChargeMove1 ? (props.pok.ChargeMove1.replace(/[a-z -]/g, "") + props.addStar(props.pok.name, props.pok.ChargeMove1)) : ""}

                {(props.pok.ChargeMove1 && props.pok.ChargeMove2) ? "/" : ""}

                {props.pok.ChargeMove2 ? (props.pok.ChargeMove2.replace(/[a-z -]/g, "") + props.addStar(props.pok.name, props.pok.ChargeMove2)) : ""}
            </div>
        </div>
    )

});

export default TableIcon