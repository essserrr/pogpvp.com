const initialState = {
    username: "",
    accessToken: "",
    expiresAt: 0,
    fprint: "",
    isLoading: true,
}

const Session = (state = initialState, action) => {
    switch (action.type) {
        case "SET_SESSION":
            return {
                ...state,
                accessToken: action.value.token,
                expiresAt: action.value.expires,
                username: action.value.uname,
                isLoading: false,
            }
        case "SET_FINGERPRINT":
            return {
                ...state,
                fprint: action.value,
            }
        case "END_LOADING":
            return {
                ...state,
                isLoading: false,
            }
        case "START_LOADING":
            return {
                ...state,
                isLoading: true,
            }
        default:
            return state
    }
}

export default Session