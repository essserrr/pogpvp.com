import { getCookie } from "../../js/getCookie"

export const refresh = () => {
    return (dispatch, getState) => {
        let state = getState(),
            appS = getCookie("appS");
        if (!appS || appS === "false") {
            console.log("refresh aborted")
            dispatch({
                type: "END_LOADING",
                value: { token: "", expires: "", uname: "" }
            })
            return
        }

        switch (state.session.jwt === "" || state.session.expiresAt - (Date.now() / 1000) < 5) {
            case true:
                return fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/refresh", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }
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