import { createStore, applyMiddleware } from "redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import thunk from "redux-thunk"


import AppReducer from "./Reducers/Index"

const persistConfig = {
    key: "session",
    storage: storage,
    whitelist: ["session", "parties"]
}

const persistedReducer = persistReducer(persistConfig, AppReducer)

const store = createStore(persistedReducer, applyMiddleware(thunk))
const persistor = persistStore(store)

export { persistor, store }