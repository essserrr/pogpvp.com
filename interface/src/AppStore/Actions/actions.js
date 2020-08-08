export const setSession = value => ({
    type: "SET_SESSION",
    value
})
export const startLoading = () => ({
    type: "START_LOADING",
})
export const endLoading = () => ({
    type: "END_LOADING",
})


export const setCustomMoves = value => ({
    type: "SET_CUSTOM_MOVES",
    value
})
export const setCustomMovesError = value => ({
    type: "SET_CUSTOM_MOVES_ERROR",
    value
})


export const setMoveBase = value => ({
    type: "SET_MOVE_BASE",
    value
})
export const setPokemonBase = value => ({
    type: "SET_POKEMON_BASE",
    value
})
export const setBasesError = value => ({
    type: "SET_BASES_ERROR",
    value
})
