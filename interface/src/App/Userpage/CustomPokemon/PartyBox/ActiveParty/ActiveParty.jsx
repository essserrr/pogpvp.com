import React from "react"

import UserPokCard from "../../PokemonBox/UserPokemonList/UserPokCard/UserPokCard"

import "./ActiveParty.scss"

class ActiveParty extends React.PureComponent {
    render() {
        return (
            <>
                <div className="user-active-party__title col-12 px-0">{`${this.props.label} ${this.props.list.length}/${this.props.maxSize}`}</div>
                <div className="user-active-party row mx-0 py-1 justify-content-center">
                    {this.props.list.map((value, index) =>
                        <UserPokCard
                            key={index}
                            index={index}

                            attr={this.props.attr}
                            value={value}

                            moveTable={this.props.moveTable}
                            pokemonTable={this.props.pokemonTable}

                            onClick={this.props.onPokemonDelete}
                            onPokemonEdit={this.props.onPokemonEdit}
                        />)}
                </div>
            </>
        );
    }
}

export default ActiveParty

