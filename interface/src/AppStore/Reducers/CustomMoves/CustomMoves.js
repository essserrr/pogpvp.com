const initialState = {
    moves: {},
    error: "",
}

const CustomMoves = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CUSTOM_MOVES":
            return {
                ...state,
                moves: action.value,
                error: "",
            }
        case "SET_CUSTOM_MOVES_ERROR":
            return {
                ...state,
                error: action.value,
            }
        default:
            return state
    }
}

export default CustomMoves