const initialState = {
    parties: {},
}

const SavedParties = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_PARTY":
            return {
                ...state,
                parties: { ...state.parties, ...action.value },
            }
        case "DELETE_PARTY":
            let newParties = { ...state.parties }
            delete newParties[action.value]
            return {
                ...state,
                parties: newParties,
            }
        default:
            return state
    }
}

export default SavedParties