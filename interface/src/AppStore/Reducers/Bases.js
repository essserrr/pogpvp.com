const initialState = {
    moveBase: {},
    pokemonBase: {},
    error: "",
    moveFetching: false,
    pokemonFetching: false,
}

const Bases = (state = initialState, action) => {
    switch (action.type) {
        case "START_MOVE_BASE":
            return {
                ...state,
                moveFetching: true,
            }
        case "START_POKEMON_BASE":
            return {
                ...state,
                pokemonFetching: true,
            }
        case "END_MOVE_BASE":
            return {
                ...state,
                moveFetching: false,
            }
        case "END_POKEMON_BASE":
            return {
                ...state,
                pokemonFetching: false,
            }


        case "SET_MOVE_BASE":
            return {
                ...state,
                moveBase: action.value,
                error: "",
                moveFetching: false,
            }
        case "SET_POKEMON_BASE":
            return {
                ...state,
                pokemonBase: action.value,
                error: "",
                pokemonFetching: false,
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