import React from "react"
import LocalizedStrings from "react-localization"

import Iconer from "App/Components/Iconer/Iconer"
import { getCookie } from "js/getCookie"
import { locale } from "locale/locale"

import "./CardBody.scss"

let strings = new LocalizedStrings(locale)

const CardBody = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    return (
        <div className="row justify-content-between align-items-center m-0">
            <div className="ratingcard-body--font col p-0">
                <div className="row m-0 align-items-center">
                    <span className="mr-2">
                        {strings.rating.type}
                    </span>
                    {(props.pokemonTable[props.name].Type[0] !== undefined) &&
                        <Iconer
                            className={"ratingcard-body__icon"}
                            folderName="/type/"
                            fileName={props.pokemonTable[props.name].Type[0]}
                        />}
                    {(props.pokemonTable[props.name].Type[1] !== undefined) &&
                        <Iconer
                            className={"ratingcard-body__icon ml-2"}
                            folderName="/type/"
                            fileName={props.pokemonTable[props.name].Type[1]}
                        />}
                </div>
                {strings.rating.avgRate + " " + props.entry.AvgRate} <br />
                {strings.rating.avgWin + " " + (props.entry.AvgWinrate * 100).toFixed(0) + "%"}
            </div>
            <div className="ratingcard-body__score col-auto text-center px-2 mx-2">
                {strings.rating.score}<br />
                {(props.entry.AvgRateWeighted / props.maxWeighted * 100).toFixed(1)}
            </div>
        </div>
    )
});

export default CardBody;