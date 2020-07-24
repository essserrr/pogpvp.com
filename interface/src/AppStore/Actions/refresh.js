import { getFingerprint } from "../../App/Registration/Fingerprint"
import { getCookie } from "../../js/indexFunctions"

export const calcFprint = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (state.session.fprint !== "") {
            return
        }
        return getFingerprint()
            .then(fprint => {
                if (!fprint) {
                    return
                }
                dispatch({
                    type: "SET_FINGERPRINT",
                    value: fprint
                })
            })
            .catch(() => {
                return
            })
    }
}



export const refresh = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (state.session.fprint === "") {
            dispatch({
                type: "END_LOADING",
                value: { token: "", expires: "", uname: "" }
            })
            return
        }
        if (!getCookie("appS")) {
            dispatch({
                type: "END_LOADING",
                value: { token: "", expires: "", uname: "" }
            })
            return
        }

        switch (state.session.accessToken === "" || state.session.expiresAt - (Date.now() / 1000) < 5) {
            case true:
                return fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/refresh", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fingerprint: state.session.fprint })
                }).then(resp => {
                    if (!resp) {
                        return
                    }
                    return resp.json()
                })
                    .then(data => {
                        if (!data) {
                            dispatch({
                                type: "SET_SESSION",
                                value: { token: "", expires: "", uname: "" }
                            })
                            return
                        }
                        if (data.detail) {
                            dispatch({
                                type: "SET_SESSION",
                                value: { token: "", expires: "", uname: "" }
                            })
                            return
                        }
                        dispatch({
                            type: "SET_SESSION",
                            value: { token: data.Token, expires: data.Expires, uname: data.Username }
                        })

                    }).catch(r => {
                        dispatch({
                            type: "SET_SESSION",
                            value: { token: "", expires: "", uname: "" }
                        })
                        return
                    })
            default:
                dispatch({
                    type: "END_LOADING",
                    value: { token: "", expires: "", uname: "" }
                })
                return
        }
    }
}

export const fPrintAndRefresh = () => {
    return (dispatch) => {
        return dispatch(calcFprint()).then(() => {
            return dispatch(refresh())
        })
    }
}