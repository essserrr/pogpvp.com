export const fetchProfile = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (state.session.accessToken === "" || state.session.expiresAt - (Date.now() / 1000) < 5000) {
            return fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/refresh", {
                method: "get",
                headers: { "Content-Type": "application/json", }
            }).catch(function (r) {
                //err handlinf
                return
            }).then(resp => { resp.json() })
                .then(data => {
                    if (data.detail) {
                        //err handlinf
                    } else {
                        /*
dispatch({
                type: "SET_HISTORY",
                value: { request: reqObject, response: JSON.stringify(e, null, 2), isErr: true }
            })
                        */
                        console.log(data)
                    }
                })
        }
    }
}