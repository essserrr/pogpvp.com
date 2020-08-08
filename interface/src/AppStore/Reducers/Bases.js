const initialState = {
    moveBase: {},
    pokemonBase: {},
    error: "",
}

const Bases = (state = initialState, action) => {
    switch (action.type) {
        case "SET_MOVE_BASE":
            return {
                ...state,
                moveBase: action.value,
                error: ""
            }
        case "SET_POKEMON_BASE":
            return {
                ...state,
                pokemonBase: action.value,
                error: "",
            }
        case "SET_BASES_ERROR":
            return {
                ...state,
                error: action.value,
            }
        default:
            return state
    }
}

export default Bases