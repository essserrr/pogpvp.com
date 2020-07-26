import React from "react";
import { getCookie } from "../../../js/getCookie"
import { connect } from 'react-redux'

import TimeConverter from "./TimeConverter"
import Loader from "../../PvpRating/Loader"
import Errors from "../../PvP/components/Errors/Errors"
import { refresh } from "../../../AppStore/Actions/refresh"
import LocalizedStrings from "react-localization"
import { userLocale } from "../../../locale/userLocale"

import "./Info.scss"

let strings = new LocalizedStrings(userLocale);


class Info extends React.PureComponent {
    constructor(props) {
        super(props);
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            loading: false,
            uInfo: {},
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
            process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/info", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ AccessToken: this.props.session.jwt })
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            this.setState({ error: String(reason), })
            return
        }

        let data = await response.json()
        if (!response.ok) {
            this.setState({ error: data.detail, });
            return
        }

        this.setState({
            uInfo: data,
            loading: false,
        })
    }



    render() {
        return (
            <div className="col p-3 text-center">
                {this.state.loading &&
                    <Loader
                        color="black"
                        weight="500"
                        locale={strings.loading}
                        loading={this.state.loading}
                    />}
                {this.state.error !== "" && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                {this.state.error === "" && <>
                    <div className="col px-0 pt-2 user-info--border">
                        <span className={"user-info__text"}>{strings.info.name + ": "}</span>
                        {this.state.uInfo.Username}
                    </div>
                    <div className="col px-0 pt-2 user-info--border">
                        <span className={"user-info__text"}>{strings.info.email + ": "}</span>
                        {this.state.uInfo.Email}
                    </div>
                    <div className="col px-0 pt-2">
                        <span className={"user-info__text"}>{strings.info.reg + ": "}</span>
                        <TimeConverter time={this.state.uInfo.RegAt} getTime={false} />
                    </div>
                </>}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh())
    }
}

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(Info)