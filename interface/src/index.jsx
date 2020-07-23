import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App/App.jsx";
import "./css/customTheme.scss"
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";


import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import AppReducer from './AppStore/Reducers/Index'

const AppStore = createStore(AppReducer, applyMiddleware(thunk))


const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
    ReactDom.hydrate(
        <BrowserRouter>
            <Provider store={AppStore}><App /></Provider>
        </BrowserRouter >,
        rootElement);
} else {
    ReactDom.render(
        <BrowserRouter>
            <Provider store={AppStore}><App /></Provider>
        </BrowserRouter >,
        rootElement);
}
