//history middleware catches and precesses history actions
export const history = store => next => action => {
    switch (action.type) {
        case "SET_HISTORY":
            var historyArr = store.getState().history.historyArr
            var found = findIndex(historyArr, action.value)
            switch (found.ok) {
                case true:
                    var newArr = [action.value, ...historyArr.slice(0, found.index),
                    ...historyArr.slice(found.index + 1, historyArr.length),]
                    next({ type: "SET_HISTORY", value: newArr })
                    break
                default:
                    if (historyArr.length === 15) {
                        historyArr = historyArr.slice(0, 14)
                    }
                    newArr = [action.value, ...historyArr]
                    next({ type: "SET_HISTORY", value: newArr })
            }
            return
        case "DELETE_FROM_HISTORY":
            historyArr = store.getState().history.historyArr
            next({
                type: "SET_HISTORY",
                value: [...historyArr.slice(0, action.value), ...historyArr.slice(action.value + 1, historyArr.length),]
            })
            return
        case "CLEAR_HISTORY":
            historyArr = store.getState().history.historyArr
            next({
                type: "SET_HISTORY",
                value: []
            })
            return
        default:
            next(action)
    }
}

//if arr contains target, return index of target and ok=true. Otherwise ok=false
function findIndex(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].request.action === target.request.action &&
            arr[i].isErr === target.isErr) {
            return { ok: true, index: i }
        }
    }
    return { ok: false, index: 0 }
}