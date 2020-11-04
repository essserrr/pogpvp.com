import React from "react";
import LocalizedStrings from "react-localization";
import { loadReCaptcha } from 'react-recaptcha-google';
import { connect } from 'react-redux';

import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


import GreyPaper from '../Components/GreyPaper/GreyPaper';
import SiteHelm from "../SiteHelm/SiteHelm";
import LogForm from "./LogForm/LogForm";

import { setSession } from "AppStore/Actions/actions";
import { getCookie } from "js/getCookie";
import { userLocale } from "locale/Login/Login";
import { errors } from "locale/UserPage/Errors";

let strings = new LocalizedStrings(userLocale);
let errorStrings = new LocalizedStrings(errors);

class Login extends React.Component {
    constructor() {
        super()
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        errorStrings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: { username: "", password: "", token: "" },
            notOk: { username: "", password: "", token: "" },
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
            case "username":
                return this.checkUname(str)
            case "password":
                return this.checkPass(str)
            case "token":
                return !str ? errorStrings.err.token : ""
            default:
                return ""
        }
    }

    checkPass(str) {
        if (str.length < 6) {
            return strings.signin.pass + errorStrings.err.longer.l2 + "6" + errorStrings.err.lesseq.c
        }
        if (str.length > 20) {
            return strings.signin.pass + errorStrings.err.lesseq.l2 + "20" + errorStrings.err.lesseq.c
        }
        if (this.checkRegexp(str)) {
            return strings.signin.pass + errorStrings.err.symb
        }
        return ""
    }

    checkUname(str) {
        if (str.length < 4) {
            return strings.signin.uname + errorStrings.err.longer.l1 + "4" + errorStrings.err.lesseq.c
        }
        if (str.length > 16) {
            return strings.signin.uname + errorStrings.err.lesseq.l1 + "16" + errorStrings.err.lesseq.c
        }
        if (this.checkRegexp(str)) {
            return strings.signin.uname + errorStrings.err.symb
        }
        return ""
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")
    }

    onSubmit(resetCaptcha) {
        if (!this.validate()) {
            return
        }
        this.login(resetCaptcha)
    }

    validate() {
        let errors = {}
        Object.entries(this.state.inputs).forEach((value) => errors[value[0]] = this.check(value[1], value[0]))

        this.setState({
            notOk: errors,
        })

        return Object.values(errors).reduce((sum, value) => sum && value === "", true)
    }

    async login(resetCaptcha) {
        this.setState({
            loading: true,
            error: "",
        })

        try {
            let response = await fetch(((navigator.userAgent !== "ReactSnap") ?
                process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(this.state.inputs)
            })
            //parse answer
            let result = await response.json()
            //if response is not ok, handle error
            if (!response.ok) { throw result.detail }

            switch (!result.Username) {
                case true:
                    this.props.history.push(((navigator.userAgent === "ReactSnap") ? "/" : "/login"))
                    break
                default:
                    this.props.setSession({ expires: result.Expires, uname: result.Username })
                    this.props.history.push(((navigator.userAgent === "ReactSnap") ? "/" : "/profile/info"))
            }
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
                    url="https://pogpvp.com/login"
                    header={strings.pageheaders.log}
                    descr={strings.pagedescriptions.log}
                />

                <Grid item xs={10} sm={8} md={6} lg={4}>
                    <GreyPaper elevation={4} enablePadding={true} >
                        <Grid container justify="center" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                    {strings.signin.log}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <LogForm inputs={this.state.inputs} loading={this.state.loading} notOk={this.state.notOk}
                                    onSubmit={this.onSubmit} onChange={this.onChange} verifyCallback={this.verifyCallback} />
                            </Grid>
                            {this.state.error !== "" &&
                                <Grid item xs={12}>
                                    <Alert variant="filled" severity="error">{this.state.error}</Alert>
                                </Grid>}
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
)(Login)

