import React from "react"
import LocalizedStrings from "react-localization";
import { loadReCaptcha } from 'react-recaptcha-google'
import { connect } from 'react-redux'

import { setSession } from "../../AppStore/Actions/actions"

import RegForm from "./RegForm/RegForm"
import Errors from "../PvP/components/Errors/Errors"
import SiteHelm from "../SiteHelm/SiteHelm"
import "./Registration.scss"

import { getCookie } from "../../js/getCookie"
import { userLocale } from "../../locale/userLocale"

let strings = new LocalizedStrings(userLocale);

class Registration extends React.Component {
    constructor(props) {
        super(props)
        strings.setLanguage(getCookie("appLang") ? getCookie("appLang") : "en")
        this.state = {
            inputs: { username: "", email: "", password: "", checkPassword: "", token: "" },
            notOk: { username: "", email: "", password: "", checkPassword: "", token: "" },
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
        switch (!recaptchaToken) {
            case true:
                this.setState({
                    inputs: {
                        ...this.state.inputs,
                        token: recaptchaToken,
                    },
                    notOk: {
                        ...this.state.notOk,
                        token: strings.err.token,
                    }
                })
                break
            default:
                this.setState({
                    inputs: {
                        ...this.state.inputs,
                        token: recaptchaToken,
                    },
                    notOk: {
                        ...this.state.notOk,
                        token: ""
                    }
                })
        }

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
        if (!str || str === "") {
            return (strings.err.ness)
        }
        switch (type) {
            case "username":
                return this.checkUname(str)
            case "password":
                return this.checkPass(str)
            case "checkPassword":
                return this.checkPass(str, true)
            default:
                return this.checkEmail(str)
        }
    }

    checkPass(str, isConf) {
        if (str.length < 6) {
            return strings.signup.pass + strings.err.longer.l2 + "6" + strings.err.lesseq.c
        }
        if (str.length > 20) {
            return strings.signup.pass + strings.err.lesseq.l2 + "20" + strings.err.lesseq.c
        }
        if (this.checkRegexp(str)) {
            return strings.signup.pass + strings.err.symb
        }
        if (isConf && str !== this.state.inputs.password) {
            return strings.err.match
        }
        return ""
    }

    checkUname(str) {
        if (str.length < 4) {
            return strings.signup.uname + strings.err.longer.l1 + "4" + strings.err.lesseq.c
        }
        if (str.length > 16) {
            return strings.signup.uname + strings.err.lesseq.l1 + "16" + strings.err.lesseq.c
        }
        if (this.checkRegexp(str)) {
            return strings.signup.uname + strings.err.symb
        }
        return ""
    }

    checkEmail(str) {
        if (str.length > 320) {
            return strings.signup.email + strings.err.lesseq.l2 + "320" + strings.err.lesseq.c
        }
        if (this.checkEmailRegexp(str)) {
            return strings.err.emailf
        }
        return ""
    }

    checkEmailRegexp(email) {
        // eslint-disable-next-line
        const expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !expression.test(String(email).toLowerCase())
    }

    checkRegexp(str) {
        return !str.match("^([A-Za-z0-9@_\\-\\.!$%^&*+=]*)$")
    }

    onSubmit(resetCaptcha) {
        if (!this.validate()) {
            return
        }
        this.register(resetCaptcha)
    }


    validate() {
        let notUname = this.check(this.state.inputs.username, "username")
        let notPass = this.check(this.state.inputs.password, "password")
        let notChPass = this.check(this.state.inputs.checkPassword, "checkPassword")
        let notEmail = this.check(this.state.inputs.email, "email")
        let notToken = !this.state.inputs.token ? strings.err.token : ""

        switch (notUname !== "" || notPass !== "" || notChPass !== "" || notEmail !== "" || notToken !== "") {
            case true:
                this.setState({
                    notOk: { username: notUname, password: notPass, checkPassword: notChPass, email: notEmail, token: notToken },
                })
                return false
            default:
                return true
        }
    }

    async register(resetCaptcha) {
        let reason = ""
        this.setState({
            loading: true,
            error: "",
        })

        const response = await fetch(((navigator.userAgent !== "ReactSnap") ?
            process.env.REACT_APP_LOCALHOST : process.env.REACT_APP_PRERENDER) + "/api/auth/reg", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.inputs)
        }).catch(function (r) {
            reason = r
            return
        });
        if (reason !== "") {
            resetCaptcha()
            this.setState({
                loading: false,
                error: String(reason),
            });
            return
        }
        //parse answer
        const data = await response.json();
        //if response is not ok, handle error
        if (!response.ok) {
            resetCaptcha()
            this.setState({
                loading: false,
                error: data.detail,
            })
            return
        }

        //otherwise set token
        switch (!data.Token) {
            case true:
                this.props.history.push(((navigator.userAgent === "ReactSnap") ? "/" : "/login"))
                break
            default:
                this.props.setSession({ token: data.Token, expires: data.Expires, uname: data.Username })
                this.props.history.push(((navigator.userAgent === "ReactSnap") ? "/" : "/profile/info"))
        }
    }

    render() {
        return (
            <div className="container-fluid mb-5">
                <SiteHelm
                    url="https://pogpvp.com/registration"
                    header={strings.pageheaders.reg}
                    descr={strings.pagedescriptions.reg}
                    noindex={true}
                />
                <div className="row m-0 justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 mt-4 registration align-self-center">
                        <div className="col-12 p-0 registration__text text-center">
                            {strings.signup.reg}
                        </div>
                        {this.state.error !== "" && <div className="col-12 p-0">
                            <Errors value={this.state.error} class="alert alert-danger m-2 p-2" />
                        </div>}
                        <div className="col-12 p-0">
                            <RegForm {...this.state.inputs} loading={this.state.loading} notOk={this.state.notOk}
                                onSubmit={this.onSubmit} onChange={this.onChange} verifyCallback={this.verifyCallback} />
                        </div>
                    </div>
                </div>
            </div>
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
)(Registration)

