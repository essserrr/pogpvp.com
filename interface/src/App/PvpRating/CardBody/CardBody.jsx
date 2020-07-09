import React from "react";
import LocalizedStrings from "react-localization";


import Type from "../../PvP/components/CpAndTypes/Type"
import { typeDecoder, getCookie } from "../../../js/indexFunctions"

import { locale } from "../../../locale/locale"

let strings = new LocalizedStrings(locale);

const CardBody = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    return (
        <div className="row justify-content-between m-0">
            <div className="col dexFont p-0">
                <div className="row m-0">
                    <span className="align-self-center  mr-2">
                        {strings.rating.type}
                    </span>
                    {(props.pokemonTable[props.name].Type[0] !== undefined) && <Type
                        class={"icon18"}
                        code={props.pokemonTable[props.name].Type[0]}
                        value={typeDecoder[props.pokemonTable[props.name].Type[0]]}
                    />}
                    {(props.pokemonTable[props.name].Type[1] !== undefined) && <Type
                        class={"ml-2 icon18"}
                        code={props.pokemonTable[props.name].Type[1]}
                        value={typeDecoder[props.pokemonTable[props.name].Type[1]]}
                    />}
                </div>
                {strings.rating.avgRate + " " + props.entry.AvgRate} <br />
                {strings.rating.avgWin + " " + (props.entry.AvgWinrate * 100).toFixed(0) + "%"}
            </div>
            <div className="col-auto styleRating text-center align-self-center px-2 mx-2" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {strings.rating.score}<br />
                {(props.entry.AvgRateWeighted / props.maxWeighted * 100).toFixed(1)}
            </div>
        </div>
    )
});

export default CardBody;