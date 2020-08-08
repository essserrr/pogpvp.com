export const getMoveBase = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (Object.keys(state.bases.moveBase).length > 0) {
            console.log("Moves skipped")
            return { ok: true }
        }

        console.log("Moves fetched")
        return fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/moves", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip", },
        })
            .then(resp => {
                if (!resp) { throw new Error("No response") }
                return resp.json()
            })
            .then(data => {
                if (!data) { throw new Error("No response") }
                if (data.detail) { throw data.detail }
                dispatch({ type: "SET_MOVE_BASE", value: data })
                return { ok: true }
            }).catch(r => {
                dispatch({ type: "SET_BASES_ERROR", value: String(r), })
                return { ok: false }
            })
    }
}