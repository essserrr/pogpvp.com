
export const getMoves = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (state.customMoves.moves.length > 0) { return }

        switch (state.session.jwt !== "" && state.session.expiresAt - (Date.now() / 1000) > 5) {
            case true:
                return fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/getmoves", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({ AccessToken: state.session.jwt })
                }).then(resp => {
                    if (!resp) {
                        return
                    }
                    return resp.json()
                })
                    .then(data => {
                        if (!data) {
                            dispatch({ type: "SET_CUSTOM_MOVES", value: {}, })
                            return
                        }
                        if (data.detail) {
                            dispatch({ type: "SET_CUSTOM_MOVES", value: {}, })
                            return
                        }
                        dispatch({ type: "SET_CUSTOM_MOVES", value: data })

                    }).catch(r => {
                        dispatch({ type: "SET_CUSTOM_MOVES", value: {}, })
                        return
                    })
            default:
                return
        }
    }
}