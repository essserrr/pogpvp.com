
import { getCookie } from "../../js/getCookie"

export const getCustomMoves = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (Object.keys(state.customMoves.moves).length > 0) {
            return { ok: true }
        }
        switch (!!getCookie("sid")) {
            case true:
                return fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/getmoves", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json", },
                })
                    .then(resp => {
                        if (!resp) { throw new Error("No response") }
                        return resp.json()
                    })
                    .then(data => {
                        if (!data) { throw new Error("No response") }
                        if (data.detail) { throw data.detail }
                        dispatch({ type: "SET_CUSTOM_MOVES", value: data })
                        return { ok: true }
                    }).catch(r => {
                        dispatch({ type: "SET_CUSTOM_MOVES", value: {}, })
                        return { ok: false, detail: String(r) }
                    })
            default:
                return { ok: true }
        }
    }
}