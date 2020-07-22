import React from "react"
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

import Main from "./Main.jsx"
import Navbar from "./Navbar/Navbar.jsx"
import Footer from "./Footer/Footer"

import AppReducer from '../AppStore/Reducers/Index'

const AppStore = createStore(AppReducer, applyMiddleware(thunk))


const App = () => (
    <Provider store={AppStore}>
        <Navbar />
        <Main />
        <Footer />
    </Provider>
)

export default App