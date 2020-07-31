import React from "react";
import LocalizedStrings from "react-localization";
import { useMediaQuery } from 'react-responsive'

import Type from "../../PvP/components/CpAndTypes/Type"
import { typeDecoder, culculateCP } from "../../../js/indexFunctions"
import { getCookie } from "../../../js/getCookie"
import { dexLocale } from "../../../locale/dexLocale"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import StatsTriangle from "../StatsBlock/StatsTriangle"

let strings = new LocalizedStrings(dexLocale);

const IconBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    const isSM = useMediaQuery({ query: '(max-width: 576px)' })

    return (
        <div className="row m-0 justify-content-center ">
            {isSM && <div className="row m-0 mb-2 justify-content-center justify-content-sm-start">
                <div className={"fBolder dexTitle"}># {props.value.Number} <span>{props.value.Title}</span></div>
            </div>}
            <div className="col-12 col-sm-auto p-0 d-flex justify-content-center" style={{ height: "fit-content" }}>
                <PokemonIconer
                    src={props.value.Number + (props.value.Forme !== "" ? "-" + props.value.Forme : "")}
                    class={"dexCardIcon mr-3"}
                    folder={"/art/"}
                />
            </div>
            <div className="col p-0 mt-2 mt-sm-0">
                {!isSM && <div className="row m-0 justify-content-center justify-content-sm-start">
                    <div className={"fBolder dexTitle"}># {props.value.Number} <span>{props.value.Title}</span></div>
                </div>}
                <div className="row m-0 justify-content-center justify-content-sm-between"
                    style={{ minWidth: "200px" }}>
                    <div className="col-auto p-0 ml-auto ml-sm-0 mr-4 mr-sm-0 align-self-center">
                        {props.pokMisc && props.pokMisc.ShortDescr !== "" &&
                            <div className="col-12 dexFont font-weight-bold p-0 mt-1" >
                                {props.pokMisc.ShortDescr}
                            </div>}
                        <div className="col-12 d-flex p-0 mt-1 dexFont">
                            <span className="dexFont align-self-center">{strings.mt.tp + ":"}</span>
                            <Type
                                abbrStyle="initialism align-self-center"
                                class={"ml-2  mr-1 icon24"}
                                code={props.value.Type[0]}
                                value={typeDecoder[props.value.Type[0]]} />
                            {props.value.Type.length > 1 && <Type
                                abbrStyle="initialism align-self-center"
                                class={"ml-2  mr-1 icon24"}
                                code={props.value.Type[1]}
                                value={typeDecoder[props.value.Type[1]]} />}
                        </div>
                        <div className="col-12 dexFont p-0 mt-1">
                            {"Max CP: "}
                            <span className="font-weight-bold">
                                {culculateCP(props.value.Title, 40, 15, 15, 15, props.pokTable)}
                            </span>
                        </div>
                        <div className="col-12 p-0 mt-1 dexFont">
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
