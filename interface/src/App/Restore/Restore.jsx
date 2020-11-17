import React from "react";
import LocalizedStrings from "react-localization";
import { loadReCaptcha } from 'react-recaptcha-google';
import { connect } from 'react-redux';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

import GreyPaper from 'App/Components/GreyPaper/GreyPaper';
import RestorePassForm from "./RestorePassForm/RestorePassForm";
import SiteHelm from "App/SiteHelm/SiteHelm";

import { setSession } from "AppStore/Actions/actions";
import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Restore/Restore";
import { errors } from "locale/UserPage/Errors";

let strings = new LocalizedStrings(userLocale);
let errorStrings = new LocalizedStrings(errors);

class Restore extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        errorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: { email: "", token: "" },
            notOk: { email: "", token: "" },
            loading: false,
            error: "",
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.verifyCallback = this.verifyCallback.bind(this)
    }

    componentDidMount() {
        loadReCaptcha();
    }

    verifyCallback(recaptchaToken) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                token: recaptchaToken,
            },
            notOk: {
                ...this.state.notOk,
                token: !recaptchaToken ? errorStrings.err.token : "",
            }
        })
    }

    onChange(event) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [event.target.name]: event.target.value,
            },
            notOk: {
                ...this.state.notOk,
                [event.target.name]: this.check(event.target.value, event.target.name)
            }
        })
    }

    check(str, type) {
        if (!str || str.replace(" ", "") === "") {
            return (errorStrings.err.ness)
        }
        switch (type) {
            case "email":
                return this.checkEmail(str)
            case "token":
                return !str ? errorStrings.err.token : ""
            default:
                return ""
        }
    }


    checkEmail(str) {
        if (str.length > 320) {
            return strings.restore.email + errorStrings.err.lesseq.l2 + "320" + errorStrings.err.lesseq.c
        }
        if (this.checkEmailRegexp(str)) {
            return errorStrings.err.emailf
        }
        return ""
    }

    checkEmailRegexp(email) {
        // eslint-disable-next-line
        const expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !expression.test(String(email).toLowerCase())
    }

    onSubmit(resetCaptcha) {
        if (!this.validate()) {
            return
        }
        this.restorePass(resetCaptcha)
    }


    validate() {
        let errors = {}
        Object.entries(this.state.inputs).forEach((value) => errors[value[0]] = this.check(value[1], value[0]))

        this.setState({
            notOk: errors,
        })

        return Object.values(errors).reduce((sum, value) => sum && value === "", true)
    }

    async restorePass(resetCaptcha) {
        this.setState({
            loading: true,
            error: "",
            ok: false,
        })

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/restore", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(this.state.inputs)
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            resetCaptcha()
            this.setState({
                ok: true,
                loading: false,
                inputs: { email: "", token: "" },
            })
        } catch (e) {
            resetCaptcha()
            this.setState({
                loading: false,
                error: String(e),
            })
        }
    }

    render() {
        return (
            <Grid container justify="center">
                <SiteHelm
                    url="https://pogpvp.com/restore"
                    header={strings.pageheaders.res}
                    descr={strings.pagedescriptions.res}
                />

                <Grid item xs={10} sm={8} md={6} lg={4}>
                    <GreyPaper elevation={4} enablePadding={true} >
                        <Grid container justify="center" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                    {strings.restore.res}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <RestorePassForm inputs={this.state.inputs} loading={this.state.loading} notOk={this.state.notOk}
                                    onSubmit={this.onSubmit} onChange={this.onChange} verifyCallback={this.verifyCallback} />
                            </Grid>
                            {this.state.error !== "" &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">{this.state.error}</Alert>
                                </Grid>}
                            <Snackbar open={this.state.ok} onClose={() => { this.setState({ ok: false }) }}>
                                <Alert variant="filled" severity="success">{strings.restore.ok}</Alert >
                            </Snackbar>
                        </Grid>
                    </GreyPaper>
                </Grid>
            </Grid>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        setSession: value => dispatch(setSession(value)),
    }
}


export default connect(
    state => ({
        session: state.session,
    }), mapDispatchToProps
)(Restore)

