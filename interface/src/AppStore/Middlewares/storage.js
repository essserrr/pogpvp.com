//storage middleware catches and stores actions
export const storage = store => next => action => {
    if (action.type === "SET_HISTORY") {
        localStorage.setItem("history", JSON.stringify(action.value));
    }
    next(action)
}
