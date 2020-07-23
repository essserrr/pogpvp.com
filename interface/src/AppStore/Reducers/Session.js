const initialState = {
    username: "",
    accessToken: "",
    expiresAt: 0,
}

const Session = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SESSION':
            return {
                accessToken: action.value.token,
                expiresAt: action.value.expires,
                username: action.value.uname,
            }
        default:
            return state
    }
}

export default Session