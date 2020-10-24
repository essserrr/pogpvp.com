import React from "react";
import { getCookie } from "../../../js/getCookie";
import { connect } from "react-redux";

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import SiteHelm from "../../SiteHelm/SiteHelm";
import TimeConverter from "./TimeConverter";
import ContentTitle from "../ContentTitle/ContentTitle"


import Errors from "../../PvP/components/Errors/Errors";
import { refresh } from "../../../AppStore/Actions/refresh";
import LocalizedStrings from "react-localization";
import { userLocale } from "../../../locale/userLocale";

import "./Info.scss";

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
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/profile/info"
                    header={strings.pageheaders.usrinfo}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />

                {this.state.loading && <LinearProgress color="secondary" />}

                {this.state.error !== "" && <Errors class="alert alert-danger p-2" value={this.state.error} />}

                {this.state.error === "" && !this.state.loading && this.state.uInfo.Username &&
                    <Grid item sm={12} md={8} lg={6}>
                        <Grid item xs={12}>
                            <ContentTitle>
                                {strings.info.title}
                            </ContentTitle>
                        </Grid>
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
                            <span className={"font-weight-bold"}><TimeConverter timestamp={this.state.uInfo.RegAt} getHours={false} /></span>
                        </div>
                    </Grid>}
            </Grid>
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