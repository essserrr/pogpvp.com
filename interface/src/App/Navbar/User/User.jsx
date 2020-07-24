import React from "react";
import DropdownMenu from "..//DropdownMenu"
import { Link } from "react-router-dom"
import { connect } from 'react-redux'

import { getCookie } from "../../../js/indexFunctions.js"

import LocalizedStrings from "react-localization"
import { locale } from "../../../locale/locale"

let strings = new LocalizedStrings(locale)


class User extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            userOpts: [
                <Link key="profile" className="dropdown-item " to="/profile"><i className="far fa-address-card fa-lg mr-1"></i>
                    {strings.navbar.prof}</Link>,
                <div key="logout" name="logout" className="dropdown-item navbar--padding"
                    onClick={this.onClick}>
                    <i className="fas fa-sign-out-alt fa-lg mr-1"></i>{strings.navbar.sout}
                </div>
            ],
        };
    }



    render() {
        return (
            <DropdownMenu
                class="mr-2"
                dropClass="dropdown-menu-right"
                list={this.state.userOpts}
                label={
                    <>
                        <i className="fas fa-user fa-2x clickable"></i>{this.props.session.username}
                    </>}

            />
        );
    }
}

export default connect(
    state => ({
        session: state.session,
    })
)(User)