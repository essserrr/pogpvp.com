import React from "react"
import DropdownMenu from "../DropdownMenu"
import { Link } from "react-router-dom"
import { connect } from 'react-redux'

import { refresh } from "../../../AppStore/Actions/refresh"
import { setSession } from "../../../AppStore/Actions/actions"
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

        this.onClick = this.onClick.bind(this)
    }

    async onClick() {
        await this.props.refresh()
        try {
            await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/logout", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", }
            })
            this.props.setSession({ expires: 0, uname: "" })

        } catch (e) {
            this.props.setSession({ expires: 0, uname: "" })
        }
    }


    render() {
        return (
            this.props.session.username ?
                <DropdownMenu
                    class="mr-1"
                    dropClass="dropdown-menu-right"
                    list={
                        <>
                            <Link key="profile" className="dropdown-item " to="/profile/info">
                                <i className="far fa-address-card fa-lg mr-1"></i>
                                {strings.navbar.prof}</Link>
                            <div key="logout" name="logout" className="dropdown-item navuser--padding"
                                onClick={this.onClick}>
                                <i className="fas fa-sign-out-alt fa-lg mr-1"></i>{strings.navbar.sout}
                            </div>
                        </>
                    }
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
        refresh: () => dispatch(refresh()),
        setSession: (value) => dispatch(setSession(value)),
    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(User)