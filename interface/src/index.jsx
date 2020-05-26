import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App.jsx';
import "./css/customTheme.scss"
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';



ReactDom.render((
    <BrowserRouter>
        <App />
    </BrowserRouter >
), document.getElementById('root'))
