import React, { PureComponent } from "react";
import LocalizedStrings from "react-localization";

import PokemonCard from "../PokemonCard/PokemonCard"
import PokemonIconer from "../../PvP/components/PokemonIconer/PokemonIconer"
import SeparatedBlock from "./SeparatedBlock"
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
                < div key={elem.name + "wrap"} className={"col-4 col-md-3 px-1 pt-1"} >
                    <PokemonCard
                        name={elem.name}
                        icon={<a
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

                        class={"pokEggCard animShiny"}
                        classHeader={"cardHeader col-12 p-0 px-1 text-center"}
                        classIcon={"icon48 my-1 p-0 align-self-center"}
                        classBody={"eggCardBody row  m-0 p-1 justify-content-center"}
                    />
                </div >
            )
            return result;
        }, [])

        //separates evocard by a separator
        structuredResult.forEach(function (elem, i, arr) {
            arr[i] = [
                <SeparatedBlock
                    key={i + "sep"}
                    elem={elem}
                    separator={i < arr.length - 1 ?
                        <div className="separator fBolder" >{strings.tips.evolveTool}</div> : null}
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