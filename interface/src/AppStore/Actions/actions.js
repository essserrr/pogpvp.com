export const setSession = value => ({
    type: "SET_SESSION",
    value
})
export const setFprint = value => ({
    type: "SET_FINGERPRINT",
    value
})
export const startLoading = () => ({
    type: "START_LOADING",
})
export const endLoading = () => ({
    type: "END_LOADING",
})