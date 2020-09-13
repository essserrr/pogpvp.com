import React from "react"

import LocalizedStrings from "react-localization"

import EvoCard from "./EvoCard"
import Tier from "../../../Evolve/EvoList/Tier/Tier"
import { getCookie } from "../../../../js/getCookie"
import { dexLocale } from "../../../../locale/dexLocale"
import { ReactComponent as Candy } from "../../../../icons/candy.svg"

let strings = new LocalizedStrings(dexLocale);

const EvoBlock = React.memo(function (props) {
    strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")


    function generateEvos() {
        let arr = []
        let candies = [0, 0]
        arr.push([])

        for (const [key, evoStages] of Object.entries(props.value)) {
            if (!evoStages) {
                continue
            }
            evoStages.forEach((stage) => {
                switch (key) {
                    case "FirstStage":
                        if (candies[0] < props.miscTable[stage.Name].Evo.Candy) { candies[0] = props.miscTable[stage.Name].Evo.Candy }
                        arr[0].push(<EvoCard key={stage.Name} name={stage.Name} pokTable={props.pokTable} />)
                        break
                    case "SecondStage":
                        if (!arr[1]) { arr.push([]) }
                        if (candies[1] < props.miscTable[stage.Name].Evo.Candy) { candies[1] = props.miscTable[stage.Name].Evo.Candy }
                        arr[1].push(<EvoCard key={stage.Name} name={stage.Name} pokTable={props.pokTable} />)
                        break
                    default:
                }
            });
        }
        return arr.map((elem, i) =>
            <Tier
                key={i + "sep"}
                class="separator dexFont"
                title={<>
                    {candies[i] > 0 && <>
                        <span className="font-weight-bold">{candies[i]}
                        </span><Candy className="icon18 ml-1 mr-2" />
                    </>}
                    {strings.stage + " " + (i + 1)}</>}
                list={elem}
            />)
    }

    return (
        <div className={"col-12 p-0 dexFont text-left"}>
            <div key={props.familyName} className="row justify-content-center m-0">
                <EvoCard name={props.familyName} pokTable={props.pokTable} />
            </div>
            {generateEvos()}
        </div>
    )

});

export default EvoBlock;