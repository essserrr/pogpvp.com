import React from "react";
import PropTypes from 'prop-types';

import UserPokemonList from "App/Userpage/CustomPokemon/PokemonBox/UserPokemonList/UserPokemonList";


class UserFilteredList extends React.PureComponent {
    check(pok) {
        const orFilter = ["ChargeMove", "ChargeMove2"];
        const equalAndFilter = ["Atk", "Def", "Sta", "Lvl", "IsShadow"];
        const containsAndFilter = ["Name", "QuickMove",];

        return (
            orFilter.reduce((sum, value) => sum || this.contains(pok[value], value), false) &&
            equalAndFilter.reduce((sum, value) => sum && this.equal(pok[value], value), true) &&
            containsAndFilter.reduce((sum, value) => sum && this.contains(pok[value], value), true)
        )
    }

    equal(value, key) {
        if (this.props.filters[key] === "" || String(this.props.filters[key]) === String(value)) {
            return true
        }
        return false
    }
    contains(value, key) {
        if (this.props.filters[key] === "") {
            return true
        }
        if (value.toLowerCase().includes(this.props.filters[key].toLowerCase())) {
            return true
        }
        return false
    }

    render() {
        return (
            <UserPokemonList
                elementsOnPage={20}
                attr={this.props.attr}
                moveTable={this.props.moveTable}
                pokemonTable={this.props.pokemonTable}
                onPokemonDelete={this.props.onPokemonDelete}
                onPokemonEdit={this.props.onPokemonEdit}
            >
                {this.props.children.filter((value) => this.check(value))}
            </UserPokemonList>
        );
    }
}

export default UserFilteredList;

UserFilteredList.propTypes = {
    onPokemonEdit: PropTypes.func,
    onPokemonDelete: PropTypes.func,
    pokemonTable: PropTypes.object.isRequired,
    moveTable: PropTypes.object.isRequired,
    attr: PropTypes.string,

    children: PropTypes.arrayOf(PropTypes.object),
};
