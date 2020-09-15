import React from "react"

import MatrixListEntry from "../MatrixPokemonList/MatrixListEntry/MatrixListEntry"
import PokemonIconer from "../PokemonIconer/PokemonIconer"

import "./MatrixPokemonList.scss"

class MatrixPokemonList extends React.PureComponent {

    addStar(pokName, moveName) {
        return (this.props.pokemonTable[pokName].EliteMoves[moveName] === 1 ? "*" : "")
    }

    createListToDisplay() {
        return this.props.list.map((elem, i) => {
            return <MatrixListEntry
                attr={this.props.attr}
                key={i}
                index={i}

                onPokemonDelete={this.props.onPokemonDelete}
                onClick={this.props.onPokRedact}

                thead={<><PokemonIconer
                    src={this.props.pokemonTable[elem.name].Number +
                        (this.props.pokemonTable[elem.name].Forme !== "" ? "-" + this.props.pokemonTable[elem.name].Forme : "")}
                    class={"matr-pok-list__icon mr-1"}
                    for={""}
                />{elem.name}</>}
                body={
                    elem.QuickMove + this.addStar(elem.name, elem.QuickMove) +
                    (elem.ChargeMove1 ? " + " + elem.ChargeMove1 + this.addStar(elem.name, elem.ChargeMove1) : "") +
                    (elem.ChargeMove2 ? " / " + elem.ChargeMove2 + this.addStar(elem.name, elem.ChargeMove2) : "")
                }
            />
        });
    }

    render() {
        return (
            <div className="matr-pok-list mb-1 px-1">
                {this.createListToDisplay()}
            </div>
        )
    }

}

export default MatrixPokemonList