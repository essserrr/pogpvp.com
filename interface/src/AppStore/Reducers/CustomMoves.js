const initialState = {
    moves: {},
}

const CustomMoves = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CUSTOM_MOVES":
            return {
                ...state,
                moves: action.value,
            }
        default:
            return state
    }
}

export default CustomMoves