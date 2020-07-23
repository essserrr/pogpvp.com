import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchProfile } from '../AppStore/Actions/fetchProfile';
import Main from "./Main.jsx"
import Navbar from "./Navbar/Navbar.jsx"
import Footer from "./Footer/Footer"


class App extends Component {
    componentDidMount = () => {
        this.props.fetchProfile()
    }

    render() {
        return (
            <>
                <Navbar />
                <Main />
                <Footer />
            </>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchProfile: () => dispatch(fetchProfile())
})

export default connect(null, mapDispatchToProps)(App);