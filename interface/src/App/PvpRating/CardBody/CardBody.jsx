import React from "react";
import LocalizedStrings from "react-localization";


import Type from "../../PvP/components/CpAndTypes/Type"
import { typeDecoder, getCookie } from "../../../js/indexFunctions"

import { locale } from "../../../locale/locale"

let strings = new LocalizedStrings(locale);

const CardBody = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    return (
        <div className="row justify-content-between m-0 p-0">
            <div className="col-10 col-sm-5 m-0 p-0">
                <div className="row  m-0 p-0">
                    <div className="col-12 m-0 p-0">
                        <div className="d-inline bigText mr-2">
                            {strings.rating.type}
                        </div>
                        {(props.pokemonTable[props.name]["Type"][0] !== undefined) && <Type
                            class={"icon18"}
                            code={props.pokemonTable[props.name]["Type"][0]}
                            value={typeDecoder[props.pokemonTable[props.name]["Type"][0]]}
                        />}
                        {(props.pokemonTable[props.name]["Type"][1] !== undefined) && <Type
                            class={"ml-2 icon18"}
                            code={props.pokemonTable[props.name]["Type"][1]}
                            value={typeDecoder[props.pokemonTable[props.name]["Type"][1]]}
                        />}
                    </div>
                    <div className="col-12 text-start bigText m-0 p-0">
                        {strings.rating.avgRate} {props.entry.AvgRate}
                    </div>
                    <div className="col-12 text-start bigText m-0 p-0">
                        {strings.rating.avgWin} {(props.entry.AvgWinrate * 100).toFixed(0)}%
                </div>
                </div>
            </div>
            <div className="col-10 col-sm-2  text-sm-center text-left  mx-sm-2 p-0 ">
                <div className="row rating  m-0 px-2 p-sm-0 ">
                    <div className="col-auto   col-sm-12 mr-1 mr-sm-0 m-0 p-0 ">
                        {strings.rating.score} </div>
                    <div className="col-auto col-sm-12 m-0 p-0 ">
                        {(props.entry.AvgRateWeighted / props.maxWeighted * 100).toFixed(1)}
                    </div>
                </div>
            </div>
        </div>
    )
});

export default CardBody;