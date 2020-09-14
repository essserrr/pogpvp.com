import React from "react"
import ReactTooltip from "react-tooltip"
import LocalizedStrings from "react-localization"
import { Link } from "react-router-dom"

import PokemonCard from "../../../Evolve/PokemonCard/PokemonCard"
import PokemonIconer from "../../../PvP/components/PokemonIconer/PokemonIconer"
import CardBody from "./CardBody"

import { capitalizeFirst, regionals } from "../../../../js/indexFunctions"
import { getCookie } from "../../../../js/getCookie"
import { locale } from "../../../../locale/locale"
import { regionLocale } from "../../../../locale/regionLocale"

import "./EggsTier.scss"

let strings = new LocalizedStrings(locale);
let regions = new LocalizedStrings(regionLocale)


const EggsTier = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    regions.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    return (
        <>
            {props.title && <div className={props.class} >{props.title}</div>}
            <div className={"row justify-content-center m-0 mb-2"}>
                {props.list.reduce((result, elem) => {
                    //format title string
                    let name = elem.replace("’", "")
                    if (!props.pokTable[name]) {
                        name = capitalizeFirst(name)
                    }
                    name = name.replace(/\.$/, "")
                    if (!props.pokTable[name]) {
                        console.log(`Critical: ""${name}" not found in the database`)
                        return result
                    }
                    //skip reginals if regionals are not selected
                    if (!props.showReg && regionals[name]) {
                        return result
                    }
                    result.push(
                        <div key={name + "wrap"} className={"col-6 col-sm-4 col-lg-3 d-flex px-1 pt-2 justify-content-center"}>
                            <PokemonCard
                                class={"eggs-tier__card col-12 p-0 pb-1"}
                                name={<div className="text-center">
                                    <>{name}</>
                                    {regionals[name] &&
                                        <><ReactTooltip
                                            className={"infoTip"}
                                            id={name} effect="solid"
                                            place={"top"}
                                            multiline={true}
                                        >
                                            {regions[regionals[name]]}
                                        </ReactTooltip>
                                            <i data-tip data-for={name} className="fas fa-info-circle ml-1">
                                            </i></>}
                                </div>}
                                icon={
                                    <Link title={strings.dexentr + name}
                                        to={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" + encodeURIComponent(name)}>
                                        <PokemonIconer
                                            src={props.pokTable[name].Number + (props.pokTable[name].Forme !== "" ?
                                                "-" + props.pokTable[name].Forme : "")}
                                            class={"eggs-tier__icon ml-0 ml-sm-1 align-self-center"} />
                                    </Link>}
                                body={<CardBody
                                    name={name}
                                    pokTable={props.pokTable}
                                />}
                                classBodyWrap="row justify-content-center justify-content-sm-between m-0"
                                classHeader={"eggs-tier__card-header col-12 px-1 mb-1 text-center"}
                                classBody={"eggs-tier__card-body col px-1 text-center"}
                            />
                        </div>)
                    return result
                }, [])}
            </div>
        </>
    )
});


export default EggsTier;
