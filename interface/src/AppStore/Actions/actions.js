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


export const setCustomPokemon = value => ({
    type: "SET_CUSTOM_POKEMON",
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


export const startPokemonBaseFetching = () => ({
    type: "START_POKEMON_BASE",
})
export const startMoveBaseFetching = () => ({
    type: "START_MOVE_BASE",
})
export const endPokemonBaseFetching = () => ({
    type: "END_POKEMON_BASE",
})
export const endMoveBaseFetching = () => ({
    type: "END_MOVE_BASE",
})


export const addParty = value => ({
    type: "ADD_PARTY",
    value
})
export const deleteParty = value => ({
    type: "DELETE_PARTY",
    value
})