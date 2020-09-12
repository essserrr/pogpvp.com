import React from "react"
import { getCookie } from "../../../../js/getCookie"
import { connect } from 'react-redux'
import LocalizedStrings from "react-localization"

import { userLocale } from "../../../../locale/userLocale"
import { refresh } from "../../../../AppStore/Actions/refresh"
import { setSession } from "../../../../AppStore/Actions/actions"
import Errors from "../../../PvP/components/Errors/Errors"
import AuthButton from "../../../Registration/RegForm/AuthButton/AuthButton"

import "./Sessions.scss"

let strings = new LocalizedStrings(userLocale);

class Sessions extends React.PureComponent {
    constructor(props) {
        super();
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            loading: false,
            sessions: [],
            error: "",
        }
        this.onClick = this.onClick.bind(this)
    }

    async onClick() {
        this.setState({
            loading: true,
            error: "",
        })
        await this.props.refresh()

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/logout/all", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", }
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.props.setSession({ expires: 0, uname: "" })

        } catch (e) {
            this.setState({
                error: e,
                loading: false,
            })
        }
    }

    render() {
        return (
            <div className="row mx-0 p-3 text-center justify-content-center">
                <div className="col-12 col-md-10 col-lg-9 px-0 sessions__title">
                    {strings.security.acts}
                </div>
                {this.state.error !== "" &&
                    <div className="col-12 col-md-10 col-lg-9 px-0 pt-3">
                        <Errors class="alert alert-danger p-2" value={this.state.error} />

                    </div>}
                {this.state.error === "" &&
                    this.props.list.map((val, key) =>
                        <div key={key}
                            className={"col-12 col-md-10 col-lg-9 px-0 px-0 py-2 sessions__hoverable-col"}

                        >
                            <span className="sessions__text">{`${strings.security.br}: `}</span>
                            <span className="font-weight-bold">{val.Browser + ", "}</span>
                            <span className="sessions__text">{`${strings.security.os}: `}</span>
                            <span className="font-weight-bold">{val.OS + ", "}</span>
                            <span className="sessions__text">{`${strings.security.ip}: `}</span>
                            <span className="font-weight-bold">{val.IP}</span>
                        </div>
                    )}
                <div className="col-12 col-md-10 col-lg-9 px-0 mt-3 d-flex justify-content-center">
                    <AuthButton
                        loading={this.state.loading}
                        title={strings.security.soutall}
                        onClick={this.onClick}
                    />
                </div>
            </div>
        )
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
)(Sessions)
