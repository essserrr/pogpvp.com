import React from "react";
import LocalizedStrings from 'react-localization';

import { getCookie } from "../../../js/indexFunctions"
import { dexLocale } from "../../../locale/dexLocale"
import { ReactComponent as Candy } from "../../../icons/candy.svg";
import EvoCard from "./EvoCard"

let strings = new LocalizedStrings(dexLocale);

const EvoBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    function generateMoves() {
        let arr = []
        arr.push(
            <div key={props.familyName} className="row justify-content-center m-0 p-0">
                <EvoCard
                    name={props.familyName}
                    pokTable={props.pokTable}
                />
            </div>)

        let subArr = []
        subArr.push([])

        let candies = [0, 0]
        for (const [key, evoStages] of Object.entries(props.value)) {
            if (!evoStages) {
                continue
            }
            for (let i = 0; i < evoStages.length; i++) {
                switch (key) {
                    case "FirstStage":
                        if (candies[0] < props.miscTable[evoStages[i].Name].Evo.Candy) {
                            candies[0] = props.miscTable[evoStages[i].Name].Evo.Candy
                        }

                        subArr[0].push(
                            <EvoCard
                                key={evoStages[i].Name}
                                name={evoStages[i].Name}
                                pokTable={props.pokTable}
                            />)
                        break
                    case "SecondStage":
                        if (!subArr[1]) {
                            subArr.push([])
                        }
                        if (candies[1] < props.miscTable[evoStages[i].Name].Evo.Candy) {
                            candies[1] = props.miscTable[evoStages[i].Name].Evo.Candy
                        }
                        subArr[1].push(
                            <EvoCard
                                key={evoStages[i].Name}
                                name={evoStages[i].Name}
                                pokTable={props.pokTable}
                            />)
                        break
                    default:
                }
            }
        }

        for (let j = 0; j < subArr.length; j++) {
            arr.push(
                <div key={j + "sep"} className="separator fBolder" >
                    {candies[j] > 0 ? <span className="font-weight-bold">{candies[j]}</span> : ""}
                    {candies[j] > 0 ? <Candy className="icon18 mx-1" /> : null}
                    {strings.stage + " " + (j + 1)}
                </div>,
                <div key={props.familyName + j} className="row m-0 p-0 justify-content-center">
                    {subArr[j]}
                </div>
            )
        }


        return arr
    }






    return (
        <div className={"col-12 m-0 p-0 dexFont text-left"}>
            {generateMoves()}
        </div>
    )

});

export default EvoBlock;