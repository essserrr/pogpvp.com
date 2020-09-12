import React from "react"
import { getCookie } from "../../../js/getCookie"
import { connect } from "react-redux"

import SiteHelm from "../../SiteHelm/SiteHelm"
import TimeConverter from "./TimeConverter"
import Loader from "../../PvpRating/Loader"
import Errors from "../../PvP/components/Errors/Errors"
import { refresh } from "../../../AppStore/Actions/refresh"
import LocalizedStrings from "react-localization"
import { userLocale } from "../../../locale/userLocale"

import "./Info.scss"

let strings = new LocalizedStrings(userLocale)


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

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/info", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.setState({
                uInfo: result,
                loading: false,
            })

        } catch (e) {
            this.setState({ error: String(e), loading: false, })
        }
    }



    render() {
        return (
            <div className="col p-3 text-center">
                <SiteHelm
                    url="https://pogpvp.com/profile/info"
                    header={strings.pageheaders.usrinfo}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                {this.state.loading &&
                    <Loader
                        color="black"
                        weight="500"
                        locale={strings.loading}
                        loading={this.state.loading}
                    />}
                {this.state.error !== "" && <Errors class="alert alert-danger p-2" value={this.state.error} />}
                {this.state.error === "" && this.state.uInfo.Username &&
                    <div className="row mx-0 justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 px-0">
                            <div className="user-info__title col-12 px-0 mb-3">
                                {strings.info.title}
                            </div>
                            <div className="col px-0 py-2 user-info--border user-info__goverable-col">
                                <span className={"user-info__text"}>{strings.info.name + ": "}</span>
                                <span className={"font-weight-bold"}>{this.state.uInfo.Username}</span>
                            </div>
                            <div className="col px-0 py-2 user-info--border user-info__goverable-col">
                                <span className={"user-info__text"}>{strings.info.email + ": "}</span>
                                <span className={"font-weight-bold"}>{this.state.uInfo.Email}</span>
                            </div>
                            <div className="col px-0 py-2 user-info__goverable-col">
                                <span className={"user-info__text"}>{strings.info.reg + ": "}</span>
                                <span className={"font-weight-bold"}><TimeConverter time={this.state.uInfo.RegAt} getTime={false} /></span>
                            </div>
                        </div>
                    </div>}
            </div>
        )
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