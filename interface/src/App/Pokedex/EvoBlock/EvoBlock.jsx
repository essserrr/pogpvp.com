import React from "react";
import EvoCard from "./EvoCard"
import CardAndSep from "./CardAndSep"


const EvoBlock = React.memo(function (props) {
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
        return arr.map((elem, i) => <CardAndSep key={i + "sep"} i={i} elem={elem} candies={candies[i]} />)
    }

    return (
        <div className={"col-12 m-0 p-0 dexFont text-left"}>
            <div key={props.familyName} className="row justify-content-center m-0 p-0">
                <EvoCard name={props.familyName} pokTable={props.pokTable} />
            </div>
            {generateEvos()}
        </div>
    )

});

export default EvoBlock;