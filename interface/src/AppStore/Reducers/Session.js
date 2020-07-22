const initialState = {
    accessToken: "",
    expiresAt: 0,
}

const Session = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SESSION':
            return {
                accessToken: action.value.token,
                expiresAt: action.value.expires,
            }
        default:
            return state
    }
}

export default Session