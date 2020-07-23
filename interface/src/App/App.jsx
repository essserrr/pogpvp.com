import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fPrintAndRefresh } from '../AppStore/Actions/refresh'
import Main from "./Main.jsx"
import Navbar from "./Navbar/Navbar.jsx"
import Footer from "./Footer/Footer"


class App extends Component {
    componentDidMount = () => {
        this.props.fPrintAndRefresh()
    }

    render() {
        return (
            !this.props.session.isLoading && <>
                <Navbar />
                <Main />
                <Footer />
            </>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fPrintAndRefresh: () => dispatch(fPrintAndRefresh()),
})

export default connect(state => ({
    session: state.session,
}), mapDispatchToProps)(App);