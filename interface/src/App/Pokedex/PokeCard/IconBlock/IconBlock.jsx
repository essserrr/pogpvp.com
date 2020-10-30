import React from "react"
import LocalizedStrings from "react-localization"
import { useMediaQuery } from 'react-responsive'

import Iconer from "App/Components/Iconer/Iconer"
import { calculateCP } from "js/indexFunctions"
import { getCookie } from "js/getCookie"
import { dexLocale } from "locale/dexLocale"
import StatsTriangle from "../StatsTriangle/StatsTriangle"

import "./IconBlock.scss"

let strings = new LocalizedStrings(dexLocale);

const IconBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const isSM = useMediaQuery({ query: '(max-width: 576px)' })

    return (
        <div className="row m-0 justify-content-center ">
            {isSM && <div className="row m-0 mb-2 justify-content-center justify-content-sm-start">
                <div className={"pokedex-iconblock__title"}># {props.value.Number} <span>{props.value.Title}</span></div>
            </div>}
            <div className="col-12 col-sm-auto p-0 d-flex justify-content-center" style={{ height: "fit-content" }}>
                <Iconer
                    fileName={props.value.Number + (props.value.Forme !== "" ? "-" + props.value.Forme : "")}
                    className={"pokedex-iconblock__icon mr-3"}
                    folderName={"/art/"}
                />
            </div>
            <div className="col p-0 mt-2 mt-sm-0">
                {!isSM && <div className="row m-0 justify-content-center justify-content-sm-start">
                    <div className={"pokedex-iconblock__title"}># {props.value.Number} <span>{props.value.Title}</span></div>
                </div>}
                <div className="row m-0 justify-content-center justify-content-sm-between"
                    style={{ minWidth: "200px" }}>
                    <div className="col-auto p-0 ml-auto ml-sm-0 mr-4 mr-sm-0 align-self-center">
                        {props.pokMisc && props.pokMisc.ShortDescr !== "" &&
                            <div className="pokedex-iconblock--text col-12 font-weight-bold p-0 mt-1" >
                                {props.pokMisc.ShortDescr}
                            </div>}
                        <div className="pokedex-iconblock--text col-12 d-flex p-0 mt-1">
                            <span className="pokedex-iconblock--text align-self-center">{strings.mt.tp + ":"}</span>
                            <Iconer
                                className={"ml-2  mr-1 icon24 align-self-center"}
                                size={24}
                                folderName="/type/"
                                fileName={props.value.Type[0]}
                            />
                            {props.value.Type.length > 1 && <Iconer
                                className={"ml-2  mr-1 icon24 align-self-center"}
                                size={24}
                                folderName="/type/"
                                fileName={props.value.Type[1]}
                            />}
                        </div>
                        <div className="pokedex-iconblock--text col-12 p-0 mt-1">
                            {"Max CP: "}
                            <span className="font-weight-bold">
                                {calculateCP(props.value.Title, 40, 15, 15, 15, props.pokTable)}
                            </span>
                        </div>
                        <div className="pokedex-iconblock--text col-12 p-0 mt-1">
                            {strings.generation + " " + props.value.Generation}
                        </div>
                    </div>

                    <div className="col-auto p-0 mr-auto mx-sm-auto align-self-center">
                        <StatsTriangle
                            value={props.value}

                            boxWidth={170}
                            boxHeight={120}
                            length={120}

                            strokeMain={1.5}
                            strokeSec={0.5}
                        />
                    </div>
                </div>
            </div>
        </div >
    )

});

export default IconBlock;
