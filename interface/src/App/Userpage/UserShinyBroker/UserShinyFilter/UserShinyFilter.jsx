import React from "react"

import UserShinyList from "../UserShinyList/UserShinyList"

class UserShinyFilter extends React.PureComponent {
    render() {

        return (
            <UserShinyList
                elemntsOnPage={50}

                attr={this.props.attr}
                pokemonTable={this.props.pokemonTable}
                list={Object.values(this.props.list)}
                onPokemonDelete={this.props.onPokemonDelete}
            />
        );
    }
}

export default UserShinyFilter

