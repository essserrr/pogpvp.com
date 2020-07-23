



import { getFingerprint } from "../../App/Registration/Fingerprint"

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
            return
        }
        if (state.session.accessToken === "" || state.session.expiresAt - (Date.now() / 1000) < 5000) {
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
                    if (!data) { return }
                    if (data.detail) { return }
                    dispatch({
                        type: "SET_SESSION",
                        value: { token: data.Token, expires: data.Expires, uname: data.Username }
                    })

                }).catch(r => {
                    return
                })
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