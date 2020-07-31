import React from "react"
import ReactDom from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { PersistGate } from 'redux-persist/lib/integration/react'

import { Provider } from 'react-redux'
import { store, persistor } from "./AppStore/Store"

import App from "./App/App.jsx";


import "./css/customTheme.scss"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap-css-only/css/bootstrap.min.css"
import "mdbreact/dist/css/mdb.css"

const rootElement = document.getElementById("root")

if (rootElement.hasChildNodes()) {
    ReactDom.hydrate(
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </BrowserRouter >,
        rootElement);
} else {
    ReactDom.render(
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </BrowserRouter >,
        rootElement);
}
