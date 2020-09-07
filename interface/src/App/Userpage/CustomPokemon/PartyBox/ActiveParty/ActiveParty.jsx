import React from "react"

import UserPokCard from "../../PokemonBox/UserPokemonList/UserPokCard/UserPokCard"

import "./ActiveParty.scss"

class ActiveParty extends React.PureComponent {
    render() {
        return (
            <>
                <div className="user-active-party__title col-12 px-0">{`${this.props.label} ${this.props.list.length}/${this.props.maxSize}`}</div>
                <div className="user-active-party row mx-0 py-1 justify-content-around">
                    {this.props.list.map((value, index) =>
                        <UserPokCard
                            style={{ minWidth: "190px" }}
                            key={index}
                            index={index}

                            attr={this.props.attr}

                            moveTable={this.props.moveTable}
                            pokemonTable={this.props.pokemonTable}

                            onClick={this.props.onPokemonDelete}

                            {...value}
                        />)}
                </div>
            </>
        );
    }
}

export default ActiveParty

