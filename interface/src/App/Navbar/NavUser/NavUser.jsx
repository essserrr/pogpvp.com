import React from "react";
import DropdownMenu from "../DropdownMenu"
import { Link } from "react-router-dom"
import { connect } from 'react-redux'

import { logout } from "../../../AppStore/Actions/logout"
import { getCookie } from "../../../js/getCookie"
import LoginReg from "./LoginReg/LoginReg"

import LocalizedStrings from "react-localization"
import { locale } from "../../../locale/locale"

import "./NavUser.scss"

let strings = new LocalizedStrings(locale)


class User extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            userOpts: [
                <Link key="profile" className="dropdown-item " to="/profile/info">
                    <i className="far fa-address-card fa-lg mr-1"></i>
                    {strings.navbar.prof}</Link>,
                <div key="logout" name="logout" className="dropdown-item navuser--padding"
                    onClick={this.props.logout}>
                    <i className="fas fa-sign-out-alt fa-lg mr-1"></i>{strings.navbar.sout}
                </div>
            ],
        };
    }



    render() {
        return (
            this.props.session.username ?
                <DropdownMenu
                    class="mr-2"
                    dropClass="dropdown-menu-right"
                    list={this.state.userOpts}
                    label={
                        <>
                            <i className="fas fa-user fa-2x clickable"></i><span className="navuser__text">{this.props.session.username}</span>
                        </>}

                /> : <LoginReg />
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(User)