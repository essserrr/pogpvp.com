import React from "react"

import UserPokemonList from "../UserPokemonList/UserPokemonList"


class UserFilteredList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.applyFilter = this.applyFilter.bind(this)
    }

    applyFilter() {
        return this.props.userList.filter((value) => {
            return (this.containsFilter(value.Name, "Name") * this.containsFilter(value.QuickMove, "QuickMove") *
                (this.containsFilter(value.ChargeMove, "ChargeMove") || this.containsFilter(value.ChargeMove2, "ChargeMove")) * this.equalFilter(value.Atk, "Atk") *
                this.equalFilter(value.Def, "Def") * this.equalFilter(value.Sta, "Sta") *
                this.equalFilter(value.Lvl, "Lvl") * this.equalFilter(value.IsShadow, "IsShadow"))
        })
    }

    equalFilter(value, key) {
        if (this.props.filters[key] === "" || String(this.props.filters[key]) === String(value)) {
            return true
        }
        return false
    }
    containsFilter(value, key) {
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
                elemntsOnPage={20}
                attr={this.props.attr}

                moveTable={this.props.moveTable}
                pokemonTable={this.props.pokemonTable}
                list={this.applyFilter()}

                onPokemonDelete={this.props.onPokemonDelete}
                onPokemonEdit={this.props.onPokemonEdit}
            />
        );
    }
}

export default UserFilteredList

