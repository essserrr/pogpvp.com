import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fPrintAndRefresh } from '../AppStore/Actions/refresh'
import { endLoading, startLoading } from '../AppStore/Actions/actions'
import Main from "./Main.jsx"
import Navbar from "./Navbar/Navbar.jsx"
import Footer from "./Footer/Footer"
import Loader from "./PvpRating/Loader"
import "./App.scss"


class App extends Component {
    componentDidMount = () => {
        switch (!this.props.session.token && this.props.session.expiresAt - (Date.now() / 1000) < 5) {
            case true:
                this.props.startLoading()
                this.props.fPrintAndRefresh()
                return
            default:
                this.props.endLoading()
        }
    }

    render() {
        return (
            this.props.session.isLoading ?
                <Loader
                    color="white"
                    weight="500"
                    locale="Logging in..."
                    loading={true}

                    height={6}
                    width={300}

                    class="row m-0 justify-content-center app"
                    innerClass="col-auto p-0 align-self-center"
                /> :
                <>
                    <Navbar />
                    <Main />
                    <Footer />
                </>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fPrintAndRefresh: () => dispatch(fPrintAndRefresh()),
    startLoading: () => dispatch(startLoading()),
    endLoading: () => dispatch(endLoading()),
})

export default connect(state => ({
    session: state.session,
}), mapDispatchToProps)(App);