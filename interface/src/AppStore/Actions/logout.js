export const logout = () => {
    return (dispatch) => {
        return fetch(((navigator.userAgent !== "ReactSnap") ?
            process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(() => {
                dispatch({
                    type: "SET_SESSION",
                    value: { token: "", expires: 0, uname: "" }
                })

            })
            .then(() => {
                dispatch({
                    type: "SET_SESSION",
                    value: { token: "", expires: 0, uname: "" }
                })

            }).catch(() => {
                dispatch({
                    type: "SET_SESSION",
                    value: { token: "", expires: 0, uname: "" }
                })
            })
    }
}