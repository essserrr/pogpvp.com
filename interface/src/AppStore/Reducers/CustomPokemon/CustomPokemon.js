const initialState = {
    pokemon: [],
    parties: {},
}

const CustomPokemon = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CUSTOM_POKEMON":
            return {
                ...state,
                pokemon: action.value.Pokemon ? action.value.Pokemon : [],
                parties: action.value.Parties ? action.value.Parties : {},
            }
        default:
            return state
    }
}

export default CustomPokemon