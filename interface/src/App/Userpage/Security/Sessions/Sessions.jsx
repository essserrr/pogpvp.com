import React from "react";
import { getCookie } from "../../../../js/getCookie";
import { connect } from 'react-redux';
import LocalizedStrings from "react-localization";
import PropTypes from 'prop-types';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { userLocale } from "../../../../locale/UserPage/Security/Security";
import { refresh } from "../../../../AppStore/Actions/refresh";
import { setSession } from "../../../../AppStore/Actions/actions";
import AuthButton from "../../../Registration/RegForm/AuthButton/AuthButton";
import SessionsTable from "./SessionsTable/SessionsTable";

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

    onClick = async () => {
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
            <Grid container justify="center">
                {this.state.error !== "" && <Alert variant="filled" severity="error">{this.state.error}</Alert >}

                {this.state.error === "" &&
                    <Grid item xs={12}>
                        <SessionsTable>
                            {this.props.children}
                        </SessionsTable>
                    </ Grid>}
                <Grid container item xs={12} justify="center">
                    <Box mt={2}>
                        <AuthButton
                            loading={this.state.loading}
                            title={strings.security.soutall}
                            onClick={this.onClick}
                        />
                    </Box>
                </ Grid>
            </ Grid>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(refresh()),
        setSession: (value) => dispatch(setSession(value)),
    }
};

export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(Sessions);

Sessions.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                Browser: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
                OS: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
                IP: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]),
            })
        ),
    ]),
};
