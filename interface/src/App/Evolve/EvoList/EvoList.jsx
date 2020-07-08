import React, { PureComponent } from "react";
import LocalizedStrings from "react-localization";

import PokemonCard from "../PokemonCard/PokemonCard"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import Tier from "../../RaidsList/Tier/Tier"
import CardBody from "./CardBody"

import { locale } from "../../../locale/locale"
import { getCookie } from "../../../js/indexFunctions"


let strings = new LocalizedStrings(locale);

class EvoList extends PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
    }



    returnEvolveList(state) {
        let list = []
        this.evolist(state.pokemonTable[state.name], state.pokemonTable, list, 0)

        //makes structured list of evocards from generated list
        let structuredResult = list.reduce((result, elem) => {
            if (!result[elem.stage]) {
                result.push([])
            }
            result[elem.stage].push(
                < div key={elem.name + "wrap"} className={"col-5 col-sm-4 col-md-4 d-flex justify-content-center px-1 pt-1"} >
                    <PokemonCard
                        class={"col-12 pokCard animShiny p-0"}
                        name={elem.name}
                        icon={<a
                            className="my-1 align-self-center"
                            title={strings.dexentr + elem.name}
                            href={(navigator.userAgent === "ReactSnap") ? "/" : "/pokedex/id/" +
                                encodeURIComponent(elem.name)}
                        >
                            <PokemonIconer
                                src={state.pokemonTable[elem.name].Number + (state.pokemonTable[elem.name].Forme !== "" ?
                                    "-" + state.pokemonTable[elem.name].Forme : "")}
                                class={"icon48"} />
                        </a>}
                        body={<CardBody
                            name={elem.name}
                            state={state}
                        />}
                        classHeader={"cardHeader fBolder col-12 px-1 text-center"}
                        classBody={"cardBody col p-1 justify-content-between"}
                    />
                </div >
            )
            return result;
        }, [])

        //separates evocard by a separator
        structuredResult.forEach(function (elem, i, arr) {
            if (i === 0) {
                arr[0] = <div className={"row justify-content-center m-0 mb-2"}>{elem}</div>
                return
            }
            arr[i] = [
                <Tier
                    key={i + "sep"}
                    class="separator dexFont my-2"
                    title={strings.tips.evolveTool}
                    list={elem}
                />]
        });
        return structuredResult
    }

    //creates list of all evolutions of selected pok
    evolist(pokEntry, pokTable, list, stage) {
        list.push({ name: pokEntry.Title, stage: stage })
        for (let i = 0; i < pokEntry.Evolutions.length; i++) {
            this.evolist(pokTable[pokEntry.Evolutions[i]], pokTable, list, stage + 1)
        }
    }


    render() {
        return (
            <>
                {this.returnEvolveList(this.props.state)}
            </>
        );
    }
}

export default EvoList;