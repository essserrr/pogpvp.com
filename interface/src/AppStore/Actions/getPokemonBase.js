export const getPokemonBase = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (Object.keys(state.bases.moveBase).length > 0) {
            console.log("Pokemon skipped")
            return { ok: true }
        }

        console.log("Pokemon fetched")
        return fetch(((navigator.userAgent !== "ReactSnap") ? process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/db/pokemons", {
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
                dispatch({ type: "SET_POKEMON_BASE", value: data })
                return { ok: true }
            }).catch(r => {
                dispatch({ type: "SET_BASES_ERROR", value: String(r), })
                return { ok: false }
            })
    }
}