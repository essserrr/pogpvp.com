import React from "react";
import { connect } from "react-redux";
import LocalizedStrings from "react-localization";

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';

import SiteHelm from "App/SiteHelm/SiteHelm";
import TimeConverter from "App/Userpage/Info/TimeConverter";
import UserPageContent from "App/Userpage/UserPageContent/UserPageContent";
import InfoTable from "App/Userpage/Info/InfoTable/InfoTable";

import { refresh } from "AppStore/Actions/refresh";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/Info/Info";

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

                {this.state.loading &&
                    <Grid item xs={12}>
                        <LinearProgress color="secondary" />
                    </ Grid>}
                {this.state.error !== "" && <Alert variant="filled" severity="error">{this.state.error}</Alert >}

                {this.state.error === "" && !this.state.loading && this.state.uInfo.Username &&
                    <Grid item xs={12} md={8} lg={6}>
                        <UserPageContent title={strings.info.title}>
                            <InfoTable>
                                {[
                                    { name: strings.info.name, info: this.state.uInfo.Username, },
                                    { name: strings.info.email, info: this.state.uInfo.Email, },
                                    { name: strings.info.reg, info: <TimeConverter timestamp={this.state.uInfo.RegAt} getHours={false} />, },
                                ]}
                            </InfoTable>
                        </UserPageContent>
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