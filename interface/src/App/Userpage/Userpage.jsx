import React from "react"
import LocalizedStrings from "react-localization";
import { connect } from 'react-redux'

import { setSession } from "../../AppStore/Actions/actions"
import Errors from "../PvP/components/Errors/Errors"
import SiteHelm from "../SiteHelm/SiteHelm"
import "./Userpage.scss"

import { getCookie } from "../../js/indexFunctions"
import { userLocale } from "../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class Userpage extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {}
    }

    componentDidMount() {
        if (this.props.session.accessToken === "") {
            this.props.history.push(((navigator.userAgent === "ReactSnap") ? "/" : "/login"))
            return
        }
    }


    render() {
        return (
            <div className="container-fluid mb-5">
                <SiteHelm
                    url="https://pogpvp.com/userpage"
                    header={strings.pageheaders.usr}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                <div className="row m-0 justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 mt-4 registration align-self-center">
                        <div className="col-12 p-0 registration__text text-center">
                            {strings.signup.reg}
                        </div>
                        {!!this.state.error && <div className="col-12 p-0">
                            <Errors value={this.state.error} class="alert alert-danger m-2 p-2" />
                        </div>}
                        <div className="col-12 p-0">
                            {this.props.session.username}
                        </div>
                        <div className="col-12 p-0">
                            {this.props.session.accessToken}
                        </div>
                        <div className="col-12 p-0">
                            {this.props.session.expiresAt}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSession: value => dispatch(setSession(value))
    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(Userpage)

