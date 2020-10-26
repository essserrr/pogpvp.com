import React from "react";
import { connect } from 'react-redux';
import LocalizedStrings from "react-localization";

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';

import SiteHelm from "App/SiteHelm/SiteHelm";
import UserPageContent from "App/Userpage/UserPageContent/UserPageContent";
import ChangePassword from "App/Userpage/Security/ChangePassword/ChangePassword";
import Sessions from "App/Userpage/Security/Sessions/Sessions";

import { getCookie } from "js/getCookie";
import { userLocale } from "locale/UserPage/Security/Security";
import { refresh } from "AppStore/Actions/refresh";

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

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/user/sessions", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            this.setState({
                sessions: result,
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
                    url="https://pogpvp.com/profile/security"
                    header={strings.pageheaders.usrsec}
                    descr={strings.pagedescriptions.usr}
                    noindex={true}
                />
                {this.state.loading &&
                    <Grid item xs={12}>
                        <LinearProgress color="secondary" />
                    </ Grid>}
                {this.state.error !== "" && <Alert variant="filled" severity="error">{this.state.error}</Alert >}

                {this.state.error === "" && !this.state.loading &&
                    <Grid item xs={12} md={10} lg={8}>
                        <UserPageContent title={strings.security.chpass}>
                            <ChangePassword />
                        </UserPageContent>
                        {this.state.sessions.length > 0 &&
                            <>
                                <Box mt={5}>
                                    <UserPageContent title={strings.security.acts}>
                                        <Sessions>
                                            {this.state.sessions}
                                        </Sessions>
                                    </UserPageContent>
                                </Box>
                            </>}
                    </Grid>}
            </Grid>
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
