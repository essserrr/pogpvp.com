
import { getCookie } from "js/getCookie"

export const getCustomPokemon = () => {
    return (dispatch, getState) => {
        let state = getState()
        if (state.customPokemon.pokemon.length > 0 || state.customPokemon.parties.length > 0) {
            return { ok: true }
        }
        switch (!!getCookie("sid")) {
            case true:
                return fetch(((navigator.userAgent !== "ReactSnap") ?
                    process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/getpokemon", {
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
                        dispatch({ type: "SET_CUSTOM_POKEMON", value: data })
                        return { ok: true }
                    }).catch(r => {
                        dispatch({ type: "SET_CUSTOM_POKEMON", value: { Pokemon: [], Parties: {} }, })
                        return { ok: false, detail: String(r) }
                    })
            default:
                return { ok: true }
        }
    }
}