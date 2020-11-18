import { getCookie } from "js/getCookie";

export const refresh = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (!getCookie("uid")) {
            dispatch({
                type: "SET_SESSION",
                value: { expires: 0, uname: "" }
            })
            return { ok: true }
        }

        switch (!getCookie("sid") || state.session.expiresAt - (Date.now() / 1000) < 5) {
            case true:
                return fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/refresh", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json", }
                }).then(resp => {
                    if (!resp) { throw new Error("No response") }
                    return resp.json()
                })
                    .then(data => {
                        if (!data) { throw new Error("No response") }
                        if (data.detail) { throw data.detail }
                        dispatch({
                            type: "SET_SESSION",
                            value: { expires: data.Expires, uname: data.Username }
                        })

                    }).catch(r => {
                        dispatch({
                            type: "SET_SESSION",
                            value: { expires: 0, uname: "" }
                        })
                        return { ok: false, detail: String(r) }
                    })
            default:
                return { ok: true }
        }
    }
}