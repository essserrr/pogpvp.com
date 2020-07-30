import React from "react"
import { getCookie } from "../../../js/getCookie"
import { connect } from 'react-redux'
import LocalizedStrings from "react-localization"

import ChangePassword from "./ChangePassword/ChangePassword"
import Sessions from "./Sessions/Sessions"
import { userLocale } from "../../../locale/userLocale"
import { refresh } from "../../../AppStore/Actions/refresh"
import Loader from "../../PvpRating/Loader"
import Errors from "../../PvP/components/Errors/Errors"

let strings = new LocalizedStrings(userLocale);


class Security extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")

        this.state = {
            loading: false,
            sessions: [],
            error: "",
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        })
        await this.props.refresh()

        let reason = ""
        const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
            process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ AccessToken: this.props.session.jwt })
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({ error: String(reason), loading: false, })
            return
        }

        let data = await response.json()
        if (!response.ok) {
            this.setState({ error: data.detail, loading: false, });
            return
        }

        this.setState({
            sessions: data,
            loading: false,
        })
    }


    render() {
        return (
            <div className="col px-0 text-center">
                {this.state.loading &&
                    <Loader
                        color="black"
                        weight="500"
                        locale={strings.loading}
                        loading={this.state.loading}
                    />}
                {this.state.error !== "" && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                {this.state.error === "" && <div className="row mx-0 justify-content-center">
                    <div className="col-12 px-0">
                        <ChangePassword />
                    </div>
                    {this.state.sessions.length > 0 && <div className="col-12 px-0">
                        <Sessions list={this.state.sessions} />
                    </div>}
                </div>}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(Security)
