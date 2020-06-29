import React, { PureComponent } from 'react';
import LocalizedStrings from 'react-localization';

import PokemonCard from "./PokemonCard"
import Type from "../PvP/components/CpAndTypes/Type"
import CP from "../PvP/components/CpAndTypes/CP"
import PokemonIconer from "../PvP/components/PokemonIconer/PokemonIconer"


import { locale } from "../../locale/locale"
import { getCookie, typeDecoder } from "../../js/indexFunctions"


let strings = new LocalizedStrings(locale);

class EvoList extends PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
        };
        this.returnEvolveList = this.returnEvolveList.bind(this);
    }

    evolist(pokEntry, pokTable, list, stage) {
        list.push({ name: pokEntry.Title, stage: stage })
        for (let i = 0; i < pokEntry.Evolutions.length; i++) {
            this.evolist(pokTable[pokEntry.Evolutions[i]], pokTable, list, stage + 1)
        }
    }

    returnEvolveList(state) {
        let list = []
        this.evolist(state.pokemonTable[state.name], state.pokemonTable, list, 0)

        let result = []
        for (let i = 0; i < list.length; i++) {
            if (!result[list[i].stage]) {
                result.push([])
            }
            this.pushPokecard(list[i].name, state, result[list[i].stage], state.pokemonTable)
        }

        for (let i = 0; i < result.length; i++) {
            result[i] = this.pushPokecardWrapper(result[i],
                i < result.length - 1 ?
                    <div key={i + "sep"} className="separator" >{strings.tips.evolveTool}</div> : null,
                i + "Evo")
        }

        return result
    }

    pushPokecard(name, state, array, pokTable) {
        array.push(
            <div key={name + "wrap"} className={"col-4 col-md-3 px-1 pt-1"}>
                <PokemonCard
                    class={"pokEggCard animShiny m-0 p-0"}

                    name={name}
                    icon={<PokemonIconer
                        src={pokTable[name].Number + (pokTable[name].Forme !== "" ? "-" + pokTable[name].Forme : "")}
                        class={"icon48"} />}
                    body={this.generateBody(name, state)}

                    classHeader={"cardHeader col-12 m-0 p-0 px-1 text-center"}
                    classIcon={"icon48 m-0 p-0 align-self-center"}
                    classBody={"eggCardBody row  m-0 p-1 justify-content-center"}
                />
            </div>)
    }

    pushPokecardWrapper(what, separator, key) {
        what = [<div key={key} className={separator ? "row justify-content-center p-0 m-0 mb-2" : "row justify-content-center p-0 m-0"}>
            {what}
        </div>]
        what.push(
            separator
        )
        return what
    }


    generateBody(name, state) {
        return <>
            <div className="col-12 text-center  m-0 p-0 align-self-start">
                {(state.pokemonTable[name]["Type"][0] !== undefined) && <Type
                    class={"icon18"}
                    code={state.pokemonTable[name]["Type"][0]}
                    value={typeDecoder[state.pokemonTable[name]["Type"][0]]}
                />}
                {(state.pokemonTable[name]["Type"][1] !== undefined) && <Type
                    class={"ml-2 icon18"}
                    code={state.pokemonTable[name]["Type"][1]}
                    value={typeDecoder[state.pokemonTable[name]["Type"][1]]}
                />}
            </div>
            <div className={"col-12 mt-1 text-center"}>
                <CP
                    name={name}
                    Lvl={state.Lvl}
                    Atk={state.Atk}
                    Def={state.Def}
                    Sta={state.Sta}
                    pokemonTable={state.pokemonTable}
                />
            </div>
        </>
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