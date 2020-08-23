export const getPokemonBase = () => {
    return (dispatch, getState) => {
        let state = getState()

        if (Object.keys(state.bases.pokemonBase).length > 0) {
            dispatch({ type: "SET_BASES_ERROR", value: "", })
            return { ok: true }
        }

        dispatch({ type: "START_POKEMON_BASE" })

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
                dispatch({ type: "END_POKEMON_BASE" })
                return { ok: false }
            })
    }
}