import React from "react";
import LocalizedStrings from "react-localization";

import PokemonCard from "../../Evolve/PokemonCard/PokemonCard"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import CardBody from "../CardBody/CardBody"
import { getCookie, capitalizeFirst } from "../../../js/indexFunctions"
import { locale } from "../../../locale/locale"

let strings = new LocalizedStrings(locale);

const RaidTier = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    return (
        <>
            {props.title && <div className={props.class} >{props.title}</div>}
            <div className={"row justify-content-center m-0 mb-2"}>
                {props.list.reduce((result, elem) => {
                    let name = elem.replace("’", "")
                    if (!props.pokTable[name]) {
                        name = capitalizeFirst(name)
                    }
                    if (!props.pokTable[name]) {
                        console.log(name + " not found")
                        return result
                    }
                    result.push(
                        <div key={name + "wrap"} className={"col-6 col-md-4 d-flex px-1 pt-2 justify-content-center"}>
                            <PokemonCard
                                class={"col-12 pokCard raid p-0 animShiny"}
                                name={name}
                                icon={
                                    <a title={strings.topcounters + props.pokTable[name].Title}
                                        href={(navigator.userAgent === "ReactSnap") ? "/" :
                                            "/pve/common/" + strings.options.moveSelect.none + "___35_15_15_15_false/" +
                                            (encodeURIComponent(props.pokTable[name].Title)) + "___" + (props.i - 1) + "/0_0_0_18_3_false"}
                                        className="align-self-center"
                                    >
                                        <PokemonIconer
                                            src={props.pokTable[name].Number + (props.pokTable[name].Forme !== "" ? "-" + props.pokTable[name].Forme : "")}
                                            class={"icon48"} />
                                    </a>}
                                body={<CardBody
                                    name={name}
                                    pokTable={props.pokTable}
                                />}

                                classHeader={"cardHeader fBolder col-12 px-1 text-center"}
                                classBody={"cardBody text-center col p-1 justify-content-center"}
                            />
                        </div>)
                    return result
                }, [])}
            </div>
        </>
    )
});
export default RaidTier;