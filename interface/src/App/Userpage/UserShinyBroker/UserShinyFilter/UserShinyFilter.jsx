import React from "react"
import PropTypes from 'prop-types';

import UserShinyList from "App/Userpage/UserShinyBroker/UserShinyList/UserShinyList";

const UserShinyFilter = React.memo(function UserShinyFilter(props) {
    return (
        <UserShinyList
            elementsOnPage={50}

            attr={props.attr}
            pokemonTable={props.pokemonTable}
            onPokemonDelete={props.onPokemonDelete}
        >
            {Object.values(props.children)}
        </UserShinyList>
    )
});


export default UserShinyFilter;

UserShinyFilter.propTypes = {
    children: PropTypes.object,
    onPokemonDelete: PropTypes.func,
    pokemonTable: PropTypes.object,
    attr: PropTypes.string,
};