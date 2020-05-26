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


    returnEvolveList(state) {
        let result = []

        //push original pokemon
        var firstEvo = []
        this.pushPokecard(state.name, state, firstEvo)
        this.pushPokecardWrapper(result, firstEvo, <div key={"firstEvo"} className="separator" >{strings.tips.evolveTool}</div>, "firstEvo1")

        //for range of original pokemon evolutions
        var secondEvo = []
        var thirdEvo = []
        for (var i = 0; i < state.pokemonTable[state.name].Evolutions.length; i++) {
            var secondName = state.pokemonTable[state.name].Evolutions[i]
            this.pushPokecard(secondName, state, secondEvo)

            //for range of an evolution evolutions
            for (var j = 0; j < state.pokemonTable[secondName].Evolutions.length; j++) {
                var thirdName = state.pokemonTable[secondName].Evolutions[j]
                if (thirdName === "") {
                    continue
                }
                this.pushPokecard(thirdName, state, thirdEvo)
            }
        }
        //push the second evolution list
        this.pushPokecardWrapper(result, secondEvo, (thirdEvo.length > 0) ? <div key={"secondEvo"} className="separator" >{strings.tips.evolveTool}</div> : null, "secondEvo2")
        //if exists push the third evolution list
        if (thirdEvo.length > 0) {
            this.pushPokecardWrapper(result, thirdEvo, null, "thirdEvo3")
        }
        return result
    }

    generateBody(name, state) {
        return <>
            <div className="col-12 text-center  m-0 p-0 align-self-start">
                {(state.pokemonTable[name]["Type"][0] !== undefined) && <Type
                    class={"cardType d-inline rounded type color" + state.pokemonTable[name]["Type"][0] + " text"}
                    value={typeDecoder[state.pokemonTable[name]["Type"][0]]}
                />}
                {(state.pokemonTable[name]["Type"][1] !== undefined) && <Type
                    class={"cardType ml-1 d-inline rounded type color" + state.pokemonTable[name]["Type"][1] + " text"}
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

    pushPokecard(name, state, array) {
        array.push(
            <div key={name + "wrap"} className={"col-4 col-md-3 px-1 pt-1"}>
                <PokemonCard
                    class={"pokEggCard animShiny m-0 p-0"}

                    name={name}
                    icon={<PokemonIconer src={name} class={"icon48"} />}
                    body={this.generateBody(name, state)}

                    classHeader={"cardHeader col-12 m-0 p-0 px-1 text-center"}
                    classIcon={"icon48 m-1 p-0 align-self-center"}
                    classBody={"eggCardBody row  m-0 p-1 justify-content-center"}
                />
            </div>)
    }

    pushPokecardWrapper(result, what, separator, key) {
        result.push(
            <div key={key} className={separator ? "row justify-content-center p-0 m-0 mb-2" : "row justify-content-center p-0 m-0"}>
                {what}
            </div>
        )
        result.push(
            separator
        )
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